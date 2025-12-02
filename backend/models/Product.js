const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    brand: { type: String, required: true, default: 'ZentroMall Originals' },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    // Sellers are stored in the User collection with role: 'seller'
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    images: [{ type: String }],
    tags: [{ type: String }],
    highlights: [{ type: String }],
    specifications: [{
        label: String,
        value: String
    }],
    variantOptions: {
        colors: [{ type: String }],
        sizes: [{ type: String }]
    },
    badges: [{ type: String }],
    deliveryInfo: {
        fastDelivery: { type: Boolean, default: false },
        cod: { type: Boolean, default: true },
        returnWindow: { type: Number, default: 7 }, // days
        shippingCharge: { type: Number, default: 0 },
        estimatedDays: { type: String, default: '2-4 days' }
    },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isDealOfDay: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    tagsPriority: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    ratingBreakdown: {
        five: { type: Number, default: 0 },
        four: { type: Number, default: 0 },
        three: { type: Number, default: 0 },
        two: { type: Number, default: 0 },
        one: { type: Number, default: 0 },
    },
    numReviews: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

// Calculate discount before saving if not provided
productSchema.pre('save', function (next) {
    if (this.mrp > this.price) {
        this.discount = Math.round(((this.mrp - this.price) / this.mrp) * 100);
    }
    next();
});

productSchema.index({ title: 'text', description: 'text', tags: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
