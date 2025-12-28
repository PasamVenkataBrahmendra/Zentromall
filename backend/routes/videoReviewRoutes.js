const express = require('express');
const router = express.Router();
const {
    uploadVideoReview,
    getProductVideoReviews,
    likeVideoReview
} = require('../controllers/videoReviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, uploadVideoReview);
router.get('/product/:productId', getProductVideoReviews);
router.post('/:id/like', protect, likeVideoReview);

module.exports = router;

