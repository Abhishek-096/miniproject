const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

router.get('/:city', weatherController.getWeather);

router.post('/cache/clean', weatherController.cleanCache);

module.exports = router;
