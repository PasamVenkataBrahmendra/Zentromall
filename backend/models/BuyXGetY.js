const mongoose = require('mongoose');

const buyXGetYSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    buyProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    buyCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    buyQuantity: { type: Number, required: true }, // Buy X
    getProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    getCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    getQuantity: { type: Number, required: true }, // Get Y
    discountType: { type: String, enum: ['free', 'percentage', 'fixed'], default: 'free' },
    discountValue: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    isActive: { type: Boolean, default: true },
    maxUses: { type: Number, default: null },
    usedCount: { type: Number, default: 0 }
}, { timestamps: true });

buyXGetYSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
buyXGetYSchema.index({ buyProduct: 1 });
buyXGetYSchema.index({ getProduct: 1 });

module.exports = mongoose.model('BuyXGetY', buyXGetYSchema);

