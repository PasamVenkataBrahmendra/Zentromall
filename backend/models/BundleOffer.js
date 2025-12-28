const mongoose = require('mongoose');

const bundleOfferSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
    bundlePrice: { type: Number, required: true },
    originalTotal: { type: Number, required: true },
    discountPercentage: { type: Number, required: true },
    image: String,
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    isActive: { type: Boolean, default: true },
    minQuantity: { type: Number, default: 1 },
    maxQuantity: { type: Number, default: null }
}, { timestamps: true });

bundleOfferSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
bundleOfferSchema.index({ products: 1 });

module.exports = mongoose.model('BundleOffer', bundleOfferSchema);

