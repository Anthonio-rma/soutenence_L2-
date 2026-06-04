const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');

router.get('/stops', busController.getStops);
router.get('/routes', busController.getRoutes);

module.exports = router;