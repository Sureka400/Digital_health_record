const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const ctrl = require('../controllers/consentController');

// All consent routes require authentication
router.use(authenticate);

// Grant a new consent
router.post('/', ctrl.grantConsent);

// Get all consents (relevant to the user)
router.get('/', ctrl.getConsents);

// Get specific consent by ID
router.get('/:consentId', ctrl.getConsentById);

// Revoke a consent
router.delete('/:consentId', ctrl.revokeConsent);

module.exports = router;
