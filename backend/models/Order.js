const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // User reference
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // Unique order identifier
    orderNumber: { 
        type: String, 
        unique: true, 
        sparse: true,
        required: true
    },
    
    // Order items
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        originalPrice: { type: Number },
        discount: { type: Number, default: 0 }
    }],
    
    // Shipping details
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
        phone: String
    },
    
    billingAddress: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
    },
    
    // Payment details
    paymentMethod: { type: String, enum: ['cod', 'card', 'upi', 'netbanking'], default: 'cod' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    paymentDetails: {
        transactionId: String,
        gateway: String, // 'razorpay', 'stripe', 'paypal', etc.
        method: String,
        paidAt: Date,
        refundAmount: Number,
        refundStatus: String
    },
    
    // Order status
    orderStatus: { type: String, enum: ['processing', 'confirmed', 'shipped', 'in_transit', 'delivered', 'returned', 'cancelled'], default: 'processing' },
    
    // Tracking information
    trackingNumber: String,
    carrier: String, // 'fedex', 'dhl', 'local', etc.
    trackingUrl: String,
    
    // Delivery dates
    estimatedDeliveryDate: Date,
    actualDeliveryDate: Date,
    
    // Pricing breakdown
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    
    // Coupon/Promo
    couponCode: String,
    couponDiscount: { type: Number, default: 0 },
    
    // Notes
    orderNotes: String,
    cancelReason: String,
    
    // Return/Refund
    isReturnable: { type: Boolean, default: true },
    returnReason: String,
    returnInitiatedDate: Date,
    returnCompletedDate: Date
}, { timestamps: true });

// Generate order number before saving
orderSchema.pre('save', async function(next) {
    if (!this.orderNumber) {
        // Format: ORD-TIMESTAMP-RANDOM
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        this.orderNumber = `ORD-${timestamp}-${random}`;
    }
    next();
});

// Index for faster queries
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderStatus: 1 });

module.exports = mongoose.model('Order', orderSchema);
