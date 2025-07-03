const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/messageController');

router.post('/contact', sendMessage);

module.exports = router;