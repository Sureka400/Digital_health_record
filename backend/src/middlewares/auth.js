const { verifyToken } = require('../utils/jwt');
const Patient = require('../models/Patient');

async function authenticate(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
    const token = auth.split(' ')[1];
    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ error: 'Invalid token' });

    // Best-effort user lookup. If not found (e.g., stale local token), keep JWT identity
    // so non-profile routes like record upload can still proceed for valid ids.
    let currentUser = null;
    try {
      currentUser = await Patient.findById(payload.id).select('-password');
    } catch (e) {
      currentUser = null;
    }

    req.currentUser = currentUser;

    // attach user with identity fields used across controllers
    req.user = {
      id: payload.id,
      role: String(payload.role || '').toUpperCase(),
      name: currentUser?.name || payload.name || '',
      email: currentUser?.email || payload.email || ''
    };
    next();
  } catch (err) {
    next(err);
  }
}

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

module.exports = { authenticate, authorize };
