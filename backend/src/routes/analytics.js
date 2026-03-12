const express = require('express');
const { getAdminAnalytics } = require('../controllers/analyticsController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/', authenticate, authorize('ADMIN'), getAdminAnalytics);

module.exports = router;
