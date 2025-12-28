const mongoose = require('mongoose');

const dailyDealSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    discountPercentage: { type: Number, required: true, min: 0, max: 100 },
    originalPrice: { type: Number, required: true },
    dealPrice: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    maxQuantity: { type: Number, default: null }, // null = unlimited
    soldQuantity: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    priority: { type: Number, default: 0 } // Higher priority shows first
}, { timestamps: true });

dailyDealSchema.index({ startDate: 1, endDate: 1 });
dailyDealSchema.index({ isActive: 1, priority: -1 });
dailyDealSchema.index({ product: 1 });

// Virtual for checking if deal is currently active
dailyDealSchema.virtual('isCurrentlyActive').get(function() {
    const now = new Date();
    return this.isActive && now >= this.startDate && now <= this.endDate;
});

module.exports = mongoose.model('DailyDeal', dailyDealSchema);

