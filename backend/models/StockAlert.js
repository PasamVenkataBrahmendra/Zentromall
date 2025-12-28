const mongoose = require('mongoose');

const stockAlertSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: { type: String, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    isActive: { type: Boolean, default: true },
    notified: { type: Boolean, default: false },
    notifiedAt: Date
}, { timestamps: true });

stockAlertSchema.index({ product: 1, isActive: 1 });
stockAlertSchema.index({ email: 1 });
stockAlertSchema.index({ user: 1 });

module.exports = mongoose.model('StockAlert', stockAlertSchema);

