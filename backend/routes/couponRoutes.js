const express = require('express');
const router = express.Router();
const {
    createCoupon,
    getCoupons,
    validateCoupon,
    deleteCoupon
} = require('../controllers/couponController');
const authMiddleware = require('../middleware/authMiddleware');

router.route('/')
    .post(authMiddleware, createCoupon)
    .get(getCoupons);

router.post('/validate', authMiddleware, validateCoupon);

router.delete('/:id', authMiddleware, deleteCoupon);

module.exports = router;
