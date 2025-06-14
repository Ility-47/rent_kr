const express = require('express');
const router = express.Router();
const rentController = require('../controllers/rentController');

router.get('/error', rentController.getErrors);
router.get('/damage', rentController.getDamages);
router.get('/auto', rentController.getAvailableAutos);
router.post('/rent', rentController.createRent);
router.get('/auto/booked/:id_client', rentController.getBookedAuto);
router.post('/finish-rent', rentController.finishRent);
router.get('/history/:userId', rentController.getFinishedRents);

module.exports = router;