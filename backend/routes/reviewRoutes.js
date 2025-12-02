const express = require('express');
const router = express.Router();
const {
    getProductReviews,
    createReview,
    updateReview,
    deleteReview,
    markHelpful,
    addSellerResponse
} = require('../controllers/reviewController');
const { protect, seller } = require('../middleware/authMiddleware');

// Product reviews
router.route('/products/:productId/reviews')
    .get(getProductReviews)
    .post(protect, createReview);

// Individual review actions
router.route('/reviews/:reviewId')
    .put(protect, updateReview)
    .delete(protect, deleteReview);

router.post('/reviews/:reviewId/helpful', protect, markHelpful);
router.post('/reviews/:reviewId/response', protect, seller, addSellerResponse);

module.exports = router;
