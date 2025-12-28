const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
    referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    referred: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    referredEmail: String,
    code: { type: String, required: true, unique: true, uppercase: true },
    status: { type: String, enum: ['pending', 'completed', 'expired'], default: 'pending' },
    rewardAmount: { type: Number, default: 0 },
    rewardType: { type: String, enum: ['credit', 'discount', 'points'], default: 'credit' },
    completedAt: Date,
    expiresAt: Date
}, { timestamps: true });

referralSchema.index({ referrer: 1 });
referralSchema.index({ code: 1 });
referralSchema.index({ referredEmail: 1 });

module.exports = mongoose.model('Referral', referralSchema);

