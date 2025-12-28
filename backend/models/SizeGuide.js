const mongoose = require('mongoose');

const sizeGuideSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    type: { 
        type: String, 
        enum: ['clothing', 'shoes', 'accessories', 'electronics', 'furniture', 'other'],
        default: 'clothing'
    },
    measurements: [{
        size: { type: String, required: true },
        chest: String,
        waist: String,
        hips: String,
        length: String,
        shoulder: String,
        sleeve: String,
        inseam: String,
        customFields: mongoose.Schema.Types.Mixed
    }],
    sizeChart: {
        image: String,
        description: String
    },
    instructions: String,
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

sizeGuideSchema.index({ product: 1 });
sizeGuideSchema.index({ category: 1 });

module.exports = mongoose.model('SizeGuide', sizeGuideSchema);

