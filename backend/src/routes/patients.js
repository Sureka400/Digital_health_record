const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const ctrl = require('../controllers/patientController');

// ✅ Patient profile
router.get('/me', authenticate, ctrl.getMe);

// ✅ Patient dashboard data
router.get('/dashboard', authenticate, ctrl.getDashboard);

// ✅ Update patient profile
router.put('/me', authenticate, ctrl.updateProfile);

// ✅ Enable emergency mode
router.post('/me/emergency', authenticate, ctrl.enableEmergency);

// ✅ Public emergency / QR access
router.post('/:patientId/emergency-access', ctrl.emergencyAccess);

module.exports = router;
