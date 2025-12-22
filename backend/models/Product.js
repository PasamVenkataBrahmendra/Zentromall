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
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },

    // Images
    images: [{ type: String }],

    // Filtering & Search
    tags: [{ type: String }],
    tagsPriority: { type: Number, default: 0 },

    // Product variants (sizes, colors) - Hybrid approach
    // We use 'variants' for specific stock keeping units (SKUs)
    variants: [{
        size: { type: String },
        color: { type: String },
        stock: { type: Number, default: 0 },
        price: { type: Number }
    }],
    // We maintain these for quick filtering/aggregation
    availableSizes: [{ type: String }],
    availableColors: [{ type: String }],

    // Specifications
    // Using array of objects to preserve order
    specifications: [{
        label: String,
        value: String
    }],
    highlights: [{ type: String }],

    // Delivery & Warranty
    deliveryInfo: {
        fastDelivery: { type: Boolean, default: false },
        cod: { type: Boolean, default: true },
        returnWindow: { type: Number, default: 7 }, // days
        shippingCharge: { type: Number, default: 0 },
        estimatedDays: { type: String, default: '2-4 days' }
    },

    // Badges & Status
    badges: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isDealOfDay: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isNewlyAdded: { type: Boolean, default: false }, // standardized alias
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },

    // Analytics
    viewCount: { type: Number, default: 0 },

    // Ratings
    rating: { type: Number, default: 0 },
    ratingBreakdown: {
        five: { type: Number, default: 0 },
        four: { type: Number, default: 0 },
        three: { type: Number, default: 0 },
        two: { type: Number, default: 0 },
        one: { type: Number, default: 0 },
    },
    numReviews: { type: Number, default: 0 }

}, { timestamps: true });

// Calculate discount before saving if not provided
productSchema.pre('save', function (next) {
    if (this.mrp > this.price) {
        this.discount = Math.round(((this.mrp - this.price) / this.mrp) * 100);
    }
    next();
});

// Indexes for text search and sorting
productSchema.index({ title: 'text', description: 'text', tags: 'text', brand: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ price: 1 });
productSchema.index({ discount: -1 });

module.exports = mongoose.model('Product', productSchema);
