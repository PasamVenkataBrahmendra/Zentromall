const express = require('express');
const router = express.Router();
const {
    getGuestCart,
    addToGuestCart,
    createGuestOrder,
    getGuestOrder
} = require('../controllers/guestCheckoutController');

router.get('/cart', getGuestCart);
router.post('/cart', addToGuestCart);
router.post('/checkout', createGuestOrder);
router.get('/orders/:orderNumber', getGuestOrder);

module.exports = router;

