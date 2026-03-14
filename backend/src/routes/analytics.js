const express = require('express');
const { getAdminAnalytics, getPolicyInsights, getSystemMonitoring } = require('../controllers/analyticsController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/', authenticate, authorize('ADMIN'), getAdminAnalytics);
router.get('/policy', authenticate, authorize('ADMIN'), getPolicyInsights);
router.get('/monitoring', authenticate, authorize('ADMIN'), getSystemMonitoring);

module.exports = router;
