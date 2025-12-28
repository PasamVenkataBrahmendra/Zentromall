const mongoose = require('mongoose');

const guestCartSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }
    }],
    email: String,
    phone: String,
    expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } // 7 days
}, { timestamps: true });

guestCartSchema.index({ sessionId: 1 });
guestCartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('GuestCart', guestCartSchema);

