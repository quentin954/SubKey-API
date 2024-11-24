const express = require('express');
const router = express.Router();
const { initializeSession } = require('../controllers/sessionController');

router.post('/init', initializeSession);

module.exports = router;