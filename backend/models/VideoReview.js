const mongoose = require('mongoose');

const videoReviewSchema = new mongoose.Schema({
    review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    videoUrl: { type: String, required: true }, // Cloudinary/AWS S3 URL
    thumbnail: String,
    duration: Number, // in seconds
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 }
}, { timestamps: true });

videoReviewSchema.index({ product: 1, status: 1 });
videoReviewSchema.index({ user: 1 });
videoReviewSchema.index({ review: 1 });

module.exports = mongoose.model('VideoReview', videoReviewSchema);

