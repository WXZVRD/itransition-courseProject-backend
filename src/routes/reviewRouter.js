const express = require('express');
const router = express.Router();
const { upload } = require('../../cloud');
const reviewController = require('../controllers/reviewController');

const checkAuth = require('../middlewares/checkAuth')
const reviewValid = require('../middlewares/validation')
const checkAccess = require('../middlewares/checkAccess')

router.get('/search', reviewController.search);
router.get('/getReview', reviewController.getReview);
router.get('/topRated', reviewController.getTopRated);
router.get('/similar', reviewController.getSimilar);
router.get('/tags', reviewController.getTags);
router.get('/latest', reviewController.getLatest);
router.get('/getById', reviewController.getReview);
router.get('/getReviewByUser', reviewController.getAllReviewByUser);
router.post('/putLike', checkAuth, reviewController.putLike);
router.post('/rateProduct', checkAuth, reviewController.rateProduct);
router.post('/create', checkAuth, reviewValid, reviewController.create);
router.post('/delete', checkAuth, checkAccess, reviewController.delete);
router.post('/update', checkAuth, reviewValid, reviewController.update);
router.post('/upload', checkAuth, upload.single('img'), reviewController.upload);

module.exports = router;
