const Patient = require('../models/Patient');
const { signToken } = require('../utils/jwt');
const { body, validationResult } = require('express-validator');

exports.registerValidators = [
  body('name').isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
];

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name, email, password, phone, preferredLanguage, role } = req.body;
    const exists = await Patient.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already registered' });
    
    const userData = { name, email, password, preferredLanguage };
    if (role && ['PATIENT', 'DOCTOR'].includes(role)) {
      userData.role = role;
    }
    
    const patient = new Patient(userData);
    if (phone) patient.phone = phone; // virtual will encrypt
    await patient.save();
    const token = signToken({ id: patient._id, role: patient.role });
    res.status(201).json({ token });
  } catch (err) { next(err); }
};

exports.loginValidators = [ body('email').isEmail(), body('password').exists() ];

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    const user = await Patient.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken({ id: user._id, role: user.role });
    res.json({ token });
  } catch (err) { next(err); }
};
