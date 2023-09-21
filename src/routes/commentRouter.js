const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/commentController');

const checkAuth = require('../middlewares/checkAuth')

router.post('/create', checkAuth, CommentController.create);
router.get('/getAll', CommentController.getAll);

module.exports = router;
