const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },

    // New fields for filtering
    brand: { type: String, default: '' },

    // Product variants (sizes, colors)
    variants: [{
        size: { type: String },
        color: { type: String },
        stock: { type: Number, default: 0 },
        price: { type: Number }
    }],

    // Available sizes and colors for filtering
    availableSizes: [{ type: String }],
    availableColors: [{ type: String }],

    // Specifications
    specifications: {
        type: Map,
        of: String,
        default: {}
    },

    images: [{ type: String }],
    tags: [{ type: String }],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },

    // Additional fields for better filtering
    isFeatured: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 }
}, { timestamps: true });

// Calculate discount before saving if not provided
productSchema.pre('save', function (next) {
    if (this.mrp > this.price) {
        this.discount = Math.round(((this.mrp - this.price) / this.mrp) * 100);
    }
    next();
});

// Indexes for better query performance
productSchema.index({ category: 1, price: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ price: 1 });
productSchema.index({ discount: -1 });

module.exports = mongoose.model('Product', productSchema);
