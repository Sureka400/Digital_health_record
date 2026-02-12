const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

router.post('/register', auth.registerValidators, auth.register);
router.post('/login', auth.loginValidators, auth.login);
router.post('/send-otp', auth.sendOTPValidators, auth.sendOTP);
router.post('/verify-otp', auth.verifyOTPValidators, auth.verifyOTP);

module.exports = router;
