const express = require('express');
const router = express.Router();
const rentController = require('../controllers/rentController');

router.get('/error', rentController.getErrors);
router.get('/damage', rentController.getDamages);
router.get('/auto', rentController.getAvailableAutos);

module.exports = router;