const express = require('express');
const router = express.Router();

const catalogController = require('../controllers/catalogController');

const checkAuth = require('../middlewares/checkAuth')

router.get('/games', checkAuth, catalogController.getGames);
router.get('/movies', checkAuth, catalogController.getMovies);
router.get('/books', checkAuth, catalogController.getBooks);

module.exports = router;
