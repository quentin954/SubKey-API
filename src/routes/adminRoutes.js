const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/createKey', adminController.createKey);
router.post('/createProduct', adminController.createProduct);
router.post('/createProductStatus', adminController.createProductStatus);

module.exports = router;