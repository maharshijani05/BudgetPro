const express = require('express');
const chatbotController = require('../Controllers/chatbotController');

const router = express.Router();

// Handle POST request to '/'
// Middleware
// Enable CORS for React frontend

router.post('/faq', chatbotController.faqhandler);
router.post('/', chatbotController.handler);
module.exports = router;