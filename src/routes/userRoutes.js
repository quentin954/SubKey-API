const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/subscriptions', isAuthenticated, userController.subscriptions);
router.post('/activateKey', isAuthenticated, userController.activateKey);

/*router.post('/resetHwid', userController.resetHwid);*/

module.exports = router;