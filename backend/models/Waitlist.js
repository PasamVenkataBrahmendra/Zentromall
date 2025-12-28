const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: { type: String, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 },
    priority: { type: Number, default: 0 }, // Higher priority gets notified first
    isActive: { type: Boolean, default: true },
    notified: { type: Boolean, default: false },
    notifiedAt: Date,
    joinedAt: { type: Date, default: Date.now }
}, { timestamps: true });

waitlistSchema.index({ product: 1, isActive: 1, priority: -1 });
waitlistSchema.index({ email: 1 });
waitlistSchema.index({ user: 1 });

module.exports = mongoose.model('Waitlist', waitlistSchema);

