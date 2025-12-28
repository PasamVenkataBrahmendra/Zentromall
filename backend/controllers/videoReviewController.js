const VideoReview = require('../models/VideoReview');
const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Upload video review
// @route   POST /api/video-reviews
// @access  Private
const uploadVideoReview = async (req, res) => {
    try {
        const { reviewId, productId, videoUrl, thumbnail, duration } = req.body;

        // Verify review exists and belongs to user
        const review = await Review.findOne({ _id: reviewId, user: req.user._id });
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if video review already exists
        const existing = await VideoReview.findOne({ review: reviewId });
        if (existing) {
            return res.status(400).json({ message: 'Video review already exists for this review' });
        }

        const videoReview = new VideoReview({
            review: reviewId,
            product: productId,
            user: req.user._id,
            videoUrl,
            thumbnail,
            duration
        });

        await videoReview.save();
        await videoReview.populate('review', 'rating comment');

        res.status(201).json(videoReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get video reviews for a product
// @route   GET /api/video-reviews/product/:productId
// @access  Public
const getProductVideoReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const videoReviews = await VideoReview.find({
            product: productId,
            status: 'approved'
        })
            .populate('user', 'name')
            .populate('review', 'rating comment')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await VideoReview.countDocuments({
            product: productId,
            status: 'approved'
        });

        res.json({
            videoReviews,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Like/Dislike video review
// @route   POST /api/video-reviews/:id/like
// @access  Private
const likeVideoReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body; // 'like' or 'dislike'

        const videoReview = await VideoReview.findById(id);
        if (!videoReview) {
            return res.status(404).json({ message: 'Video review not found' });
        }

        if (action === 'like') {
            videoReview.likes += 1;
        } else if (action === 'dislike') {
            videoReview.dislikes += 1;
        }

        await videoReview.save();

        res.json({ likes: videoReview.likes, dislikes: videoReview.dislikes });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    uploadVideoReview,
    getProductVideoReviews,
    likeVideoReview
};

