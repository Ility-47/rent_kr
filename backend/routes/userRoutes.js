const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const userController = require('../controllers/userController');

//router.get('/me', authMiddleware, userController.getCurrentUser);
router.get('/me', authMiddleware, userController.getCurrentUser);
router.post('/update-phone', authMiddleware, userController.updatePhone);
router.post('/update-email', authMiddleware, userController.updateEmail);
router.post('/update-payment', authMiddleware, userController.updatePaymentMethod);
router.post('/delete-account', authMiddleware, userController.deleteAccount);
module.exports = router;