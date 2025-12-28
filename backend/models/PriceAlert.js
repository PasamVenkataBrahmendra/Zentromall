const mongoose = require('mongoose');

const priceAlertSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: { type: String, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    targetPrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    notified: { type: Boolean, default: false },
    notifiedAt: Date
}, { timestamps: true });

priceAlertSchema.index({ product: 1, isActive: 1 });
priceAlertSchema.index({ email: 1 });
priceAlertSchema.index({ user: 1 });

module.exports = mongoose.model('PriceAlert', priceAlertSchema);

