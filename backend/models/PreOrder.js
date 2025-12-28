const mongoose = require('mongoose');

const preOrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    expectedReleaseDate: { type: Date, required: true },
    paymentStatus: { type: String, enum: ['pending', 'partial', 'paid'], default: 'pending' },
    paymentAmount: { type: Number, default: 0 },
    orderStatus: { type: String, enum: ['pre-ordered', 'processing', 'shipped', 'cancelled'], default: 'pre-ordered' },
    shippingAddress: mongoose.Schema.Types.Mixed,
    cancelledAt: Date,
    cancelledReason: String
}, { timestamps: true });

preOrderSchema.index({ user: 1 });
preOrderSchema.index({ product: 1 });
preOrderSchema.index({ expectedReleaseDate: 1 });
preOrderSchema.index({ orderStatus: 1 });

module.exports = mongoose.model('PreOrder', preOrderSchema);

