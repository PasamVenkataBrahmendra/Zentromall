const mongoose = require('mongoose');

const flashSaleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        salePrice: {
            type: Number,
            required: true
        },
        stockLimit: {
            type: Number,
            default: null
        },
        soldCount: {
            type: Number,
            default: 0
        }
    }],
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    banner: {
        type: String
    }
}, { timestamps: true });

// Index for faster queries
flashSaleSchema.index({ startTime: 1, endTime: 1, isActive: 1 });

// Virtual to check if sale is currently running
flashSaleSchema.virtual('isRunning').get(function () {
    const now = new Date();
    return this.isActive && now >= this.startTime && now <= this.endTime;
});

flashSaleSchema.set('toJSON', { virtuals: true });
flashSaleSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('FlashSale', flashSaleSchema);
