const express = require('express');
const router = express.Router();
const {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    moveToCart
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getWishlist)
    .delete(protect, clearWishlist);

router.route('/:productId')
    .post(protect, addToWishlist)
    .delete(protect, removeFromWishlist);

router.route('/:productId/move-to-cart')
    .post(protect, moveToCart);

module.exports = router;
