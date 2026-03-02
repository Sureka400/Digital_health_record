const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authenticate } = require('../middlewares/auth');

// Allow users to ask the AI. Auth is recommended for production.
router.post('/ask', authenticate, aiController.askAI);

module.exports = router;
