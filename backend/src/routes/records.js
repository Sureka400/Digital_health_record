const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const ctrl = require('../controllers/recordController');

// ✅ Get all records for logged-in patient
router.get('/', authenticate, ctrl.getRecords);

// ✅ Upload a new health record
router.post('/', authenticate, upload.single('file'), ctrl.createRecord);

// ✅ Get single record by ID
router.get('/:recordId', authenticate, ctrl.getRecordById);

// ✅ Create QR token for a record
router.post('/:recordId/qr', authenticate, ctrl.createQrToken);

// ✅ Get permanent QR token for patient profile
router.get('/profile/qr', authenticate, ctrl.getPatientProfileQr);

// ✅ Toggle consent for a record
router.patch('/:recordId/consent', authenticate, ctrl.toggleConsent);

// ✅ Download / View file
router.get('/:recordId/download', authenticate, ctrl.downloadRecord);

// ✅ QR-based record access (public / emergency)
router.get('/qr/:qrId', ctrl.getRecordByQR);

// ✅ AI Chat / Insights
router.post('/ai/chat', authenticate, ctrl.aiChat);

module.exports = router;
