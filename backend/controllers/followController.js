const Follow = require('../models/Follow');
const User = require('../models/User');

// @desc    Follow a seller
// @route   POST /api/follow
// @access  Private
const followSeller = async (req, res) => {
    try {
        const { sellerId } = req.body;

        const seller = await User.findById(sellerId);
        if (!seller || seller.role !== 'seller') {
            return res.status(404).json({ message: 'Seller not found' });
        }

        if (seller._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot follow yourself' });
        }

        const existing = await Follow.findOne({ follower: req.user._id, following: sellerId });
        if (existing) {
            return res.status(400).json({ message: 'Already following this seller' });
        }

        const follow = new Follow({
            follower: req.user._id,
            following: sellerId
        });

        await follow.save();

        res.status(201).json({ success: true, message: 'Now following seller' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Unfollow a seller
// @route   DELETE /api/follow/:sellerId
// @access  Private
const unfollowSeller = async (req, res) => {
    try {
        await Follow.findOneAndDelete({
            follower: req.user._id,
            following: req.params.sellerId
        });

        res.json({ success: true, message: 'Unfollowed seller' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get followed sellers
// @route   GET /api/follow
// @access  Private
const getFollowedSellers = async (req, res) => {
    try {
        const follows = await Follow.find({ follower: req.user._id })
            .populate('following', 'name email storeName')
            .sort({ createdAt: -1 });

        res.json(follows.map(f => f.following));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { followSeller, unfollowSeller, getFollowedSellers };

