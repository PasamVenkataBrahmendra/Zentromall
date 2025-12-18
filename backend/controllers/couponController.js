const Coupon = require('../models/Coupon');

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Private (Admin/Seller)
const createCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue, expiryDate, minPurchase, usageLimit, maxDiscount } = req.body;

        const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
        if (couponExists) {
            return res.status(400).json({ message: 'Coupon code already exists' });
        }

        const coupon = await Coupon.create({
            code,
            discountType,
            discountValue,
            expiryDate,
            minPurchase,
            usageLimit,
            maxDiscount
        });

        res.status(201).json(coupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private (Admin/Seller) or Public (filtered)
const getCoupons = async (req, res) => {
    try {
        // If query param ?active=true, return only valid public coupons
        if (req.query.active === 'true') {
            const coupons = await Coupon.find({
                isActive: true,
                expiryDate: { $gt: new Date() }
            }).select('-usedBy');
            return res.json(coupons);
        }

        const coupons = await Coupon.find({}).sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Validate coupon and calculate discount
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = async (req, res) => {
    try {
        const { code, cartTotal } = req.body;
        const userId = req.user._id;

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ message: 'Invalid coupon code' });
        }

        const validation = coupon.isValid(userId, cartTotal);
        if (!validation.valid) {
            return res.status(400).json({ message: validation.message });
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.discountType === 'percentage') {
            discountAmount = (cartTotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount) {
                discountAmount = Math.min(discountAmount, coupon.maxDiscount);
            }
        } else {
            discountAmount = coupon.discountValue;
        }

        // Ensure discount doesn't exceed total
        discountAmount = Math.min(discountAmount, cartTotal);

        res.json({
            valid: true,
            code: coupon.code,
            discountAmount: Math.round(discountAmount * 100) / 100, // round to 2 decimals
            message: 'Coupon applied successfully!'
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private (Admin)
const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        await coupon.deleteOne();
        res.json({ message: 'Coupon removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCoupon,
    getCoupons,
    validateCoupon,
    deleteCoupon
};
