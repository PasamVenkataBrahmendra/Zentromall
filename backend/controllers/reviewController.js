const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const { sort = '-createdAt', page = 1, limit = 10 } = req.query;

        const reviews = await Review.find({ product: productId })
            .populate('user', 'name')
            .sort(sort)
            .limit(Number(limit))
            .skip((page - 1) * limit);

        const total = await Review.countDocuments({ product: productId });

        res.json({
            reviews,
            page: Number(page),
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a review
// @route   POST /api/products/:productId/reviews
// @access  Private
const createReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, title, comment, images } = req.body;

        // Check if user already reviewed
        const existingReview = await Review.findOne({
            product: productId,
            user: req.user._id
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        const review = await Review.create({
            product: productId,
            user: req.user._id,
            rating,
            title,
            comment,
            images: images || []
        });

        // Update product rating
        await updateProductRating(productId);

        const populatedReview = await Review.findById(review._id).populate('user', 'name');
        res.status(201).json(populatedReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a review
// @route   PUT /api/reviews/:reviewId
// @access  Private
const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, title, comment, images } = req.body;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        review.rating = rating || review.rating;
        review.title = title || review.title;
        review.comment = comment || review.comment;
        review.images = images !== undefined ? images : review.images;

        await review.save();
        await updateProductRating(review.product);

        const populatedReview = await Review.findById(review._id).populate('user', 'name');
        res.json(populatedReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:reviewId
// @access  Private
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const productId = review.product;
        await review.deleteOne();
        await updateProductRating(productId);

        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark review as helpful
// @route   POST /api/reviews/:reviewId/helpful
// @access  Private
const markHelpful = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        const alreadyVoted = review.helpfulVotes.includes(req.user._id);

        if (alreadyVoted) {
            review.helpfulVotes = review.helpfulVotes.filter(
                id => id.toString() !== req.user._id.toString()
            );
        } else {
            review.helpfulVotes.push(req.user._id);
        }

        await review.save();
        res.json({ helpfulCount: review.helpfulVotes.length, voted: !alreadyVoted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add seller response to review
// @route   POST /api/reviews/:reviewId/response
// @access  Private/Seller
const addSellerResponse = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { comment } = req.body;

        const review = await Review.findById(reviewId).populate('product');

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user is the seller of the product
        if (review.product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only the seller can respond' });
        }

        review.sellerResponse = {
            comment,
            respondedAt: new Date()
        };

        await review.save();
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper function to update product rating
const updateProductRating = async (productId) => {
    const reviews = await Review.find({ product: productId });

    if (reviews.length === 0) {
        await Product.findByIdAndUpdate(productId, {
            rating: 0,
            numReviews: 0
        });
    } else {
        const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        await Product.findByIdAndUpdate(productId, {
            rating: Math.round(avgRating * 10) / 10,
            numReviews: reviews.length
        });
    }
};

module.exports = {
    getProductReviews,
    createReview,
    updateReview,
    deleteReview,
    markHelpful,
    addSellerResponse
};
