const express = require('express');
const router = express.Router();
const {
    createCoupon,
    getCoupons,
    validateCoupon,
    deleteCoupon
} = require('../controllers/couponController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createCoupon)
    .get(getCoupons);

router.post('/validate', protect, validateCoupon);

router.delete('/:id', protect, deleteCoupon);

module.exports = router;
