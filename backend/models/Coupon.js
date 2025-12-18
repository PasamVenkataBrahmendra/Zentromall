const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true },
    maxDiscount: { type: Number }, // Max discount amount for percentage coupons
    minPurchase: { type: Number, default: 0 },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    usageLimit: { type: Number, default: null }, // Total times it can be used globally
    usedCount: { type: Number, default: 0 },
    usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Users who have used this
}, { timestamps: true });

// Check validity method
couponSchema.methods.isValid = function (userId, cartTotal) {
    if (!this.isActive) return { valid: false, message: 'Coupon is inactive' };
    if (new Date() > this.expiryDate) return { valid: false, message: 'Coupon has expired' };
    if (this.usageLimit && this.usedCount >= this.usageLimit) return { valid: false, message: 'Coupon usage limit reached' };
    if (cartTotal < this.minPurchase) return { valid: false, message: `Minimum purchase of $${this.minPurchase} required` };
    if (userId && this.usedBy.includes(userId)) return { valid: false, message: 'You have already used this coupon' };

    return { valid: true };
};

module.exports = mongoose.model('Coupon', couponSchema);
