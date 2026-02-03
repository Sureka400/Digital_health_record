const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'change-this-secret';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function signToken(payload, opts = {}) {
  return jwt.sign(payload, SECRET, { expiresIn: opts.expiresIn || EXPIRES_IN });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = { signToken, verifyToken };
