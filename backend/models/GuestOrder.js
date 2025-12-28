const mongoose = require('mongoose');

const guestOrderSchema = new mongoose.Schema({
    orderNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    shippingAddress: {
        fullName: String,
        phone: String,
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    paymentMethod: String,
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    subtotal: Number,
    tax: Number,
    shipping: Number,
    discount: Number,
    total: Number,
    orderStatus: { type: String, enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    trackingNumber: String,
    estimatedDeliveryDate: Date
}, { timestamps: true });

guestOrderSchema.index({ email: 1 });
guestOrderSchema.index({ phone: 1 });
guestOrderSchema.index({ orderNumber: 1 });

module.exports = mongoose.model('GuestOrder', guestOrderSchema);

