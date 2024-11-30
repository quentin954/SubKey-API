const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/list', productController.getProductList);

module.exports = router;