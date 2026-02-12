const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

router.post('/register', auth.registerValidators, auth.register);
router.post('/login', auth.loginValidators, auth.login);
router.post('/send-otp', auth.sendOTPValidators, auth.sendOTP);
router.post('/verify-otp', auth.verifyOTPValidators, auth.verifyOTP);
router.post('/abha/send-otp', auth.sendAbhaOTPValidators, auth.sendAbhaOTP);
router.post('/abha/verify-otp', auth.verifyAbhaOTPValidators, auth.verifyAbhaOTP);

module.exports = router;
