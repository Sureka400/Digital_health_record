const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authenticate } = require('../middlewares/auth');

// Allow users to ask the AI. Auth is recommended for production.
router.post('/ask', authenticate, aiController.askAI);
router.get('/schemes', authenticate, aiController.getAiSchemeRecommendations);
router.post('/schemes/chat', authenticate, aiController.chatAboutSchemes);

module.exports = router;
