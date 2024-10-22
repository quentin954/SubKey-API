const express = require('express');
const { initializeSession } = require('../controllers/sessionController');

const router = express.Router();

router.post('/init', initializeSession);

module.exports = router;