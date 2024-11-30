const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/createKey', adminController.createKey);
router.post('/createProduct', adminController.createProduct);
router.post('/createProductStatus', adminController.createProductStatus);

router.post('/pauseProduct', adminController.pauseProduct);
router.post('/resumeProduct', adminController.resumeProduct);

router.post('/banKey', adminController.banKey);

router.post('/banUser', adminController.banUser);
router.put('/unbanUser/:username', adminController.unbanUser);

module.exports = router;