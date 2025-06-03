const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const userController = require('../controllers/userController');

router.get('/me', authMiddleware, userController.getCurrentUser);

module.exports = router;