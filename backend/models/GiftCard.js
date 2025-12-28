const mongoose = require('mongoose');
const crypto = require('crypto');

const giftCardSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    amount: { type: Number, required: true, min: 0 },
    balance: { type: Number, required: true, min: 0 },
    purchasedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipientEmail: String,
    recipientName: String,
    message: String,
    status: { 
        type: String, 
        enum: ['active', 'redeemed', 'expired', 'cancelled'], 
        default: 'active' 
    },
    issuedAt: { type: Date, default: Date.now },
    expiresAt: Date,
    redeemedAt: Date,
    redeemedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    transactions: [{
        type: { type: String, enum: ['purchase', 'redemption', 'refund'] },
        amount: Number,
        orderId: mongoose.Schema.Types.ObjectId,
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

giftCardSchema.index({ code: 1 });
giftCardSchema.index({ purchasedBy: 1 });
giftCardSchema.index({ recipientEmail: 1 });
giftCardSchema.index({ status: 1, expiresAt: 1 });

// Generate unique gift card code
giftCardSchema.statics.generateCode = function() {
    let code;
    do {
        code = crypto.randomBytes(4).toString('hex').toUpperCase();
    } while (this.findOne({ code }));
    return code;
};

// Pre-save hook to generate code if not provided
giftCardSchema.pre('save', async function(next) {
    if (!this.code) {
        this.code = await this.constructor.generateCode();
    }
    if (this.isNew && !this.balance) {
        this.balance = this.amount;
    }
    next();
});

module.exports = mongoose.model('GiftCard', giftCardSchema);

