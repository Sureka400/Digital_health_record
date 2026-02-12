const Patient = require('../models/Patient');
const { signToken } = require('../utils/jwt');
const { sendOTPEmail, sendLoginNotification } = require('../utils/email');
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
    
    // Send login notification email
    try {
      await sendLoginNotification(email);
    } catch (emailErr) {
      console.error('Failed to send login notification email:', emailErr);
    }

    res.json({ token });
  } catch (err) { next(err); }
};

exports.sendOTPValidators = [ body('email').isEmail() ];

exports.sendOTP = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    let user = await Patient.findOne({ email });

    if (user) {
      user.otp = otp;
      user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await user.save();
    } else {
      // If user doesn't exist, create a temporary one for demo purposes
      user = new Patient({
        name: email.split('@')[0],
        email: email,
        password: 'password123',
        role: 'PATIENT',
        otp: otp,
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000)
      });
      await user.save();
    }

    await sendOTPEmail(email, otp);
    console.log(`[OTP] Sent ${otp} to ${email}`);
    res.json({ message: 'OTP sent successfully', email });
  } catch (err) {
    next(err);
  }
};

exports.verifyOTPValidators = [
  body('email').isEmail(),
  body('otp').isLength({ min: 6, max: 6 })
];

exports.verifyOTP = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, otp } = req.body;
    const user = await Patient.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiresAt < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = signToken({ id: user._id, role: user.role });

    // Send login notification
    try {
      await sendLoginNotification(email);
    } catch (emailErr) {
      console.error('Failed to send login notification email:', emailErr);
    }

    res.json({ token, role: user.role });
  } catch (err) {
    next(err);
  }
};
