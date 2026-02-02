const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');

router.get('/', favoritesController.getAllFavorites);

router.post('/', favoritesController.addFavorite);

router.delete('/:id', favoritesController.deleteFavorite);

module.exports = router;
