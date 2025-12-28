const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, enum: ['monthly', 'yearly', 'lifetime'], required: true },
    planName: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['active', 'cancelled', 'expired', 'pending'], default: 'pending' },
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    nextBillingDate: Date,
    paymentMethod: String,
    autoRenew: { type: Boolean, default: true },
    benefits: [String],
    cancelledAt: Date,
    cancellationReason: String
}, { timestamps: true });

subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ status: 1, endDate: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);

