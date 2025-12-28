const express = require('express');
const router = express.Router();
const {
    purchaseGiftCard,
    redeemGiftCard,
    applyGiftCard,
    getMyGiftCards
} = require('../controllers/giftCardController');
const { protect } = require('../middleware/authMiddleware');

router.post('/purchase', protect, purchaseGiftCard);
router.post('/redeem', protect, redeemGiftCard);
router.post('/apply', protect, applyGiftCard);
router.get('/my-cards', protect, getMyGiftCards);

module.exports = router;

