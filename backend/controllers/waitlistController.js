const Waitlist = require('../models/Waitlist');
const Product = require('../models/Product');

// @desc    Join waitlist
// @route   POST /api/waitlist
// @access  Public
const joinWaitlist = async (req, res) => {
    try {
        const { productId, quantity = 1, email } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.stock > 0) {
            return res.status(400).json({ message: 'Product is in stock' });
        }

        // Check if already on waitlist
        const existing = await Waitlist.findOne({
            product: productId,
            email: email || req.user?.email,
            isActive: true
        });

        if (existing) {
            return res.status(400).json({ message: 'Already on waitlist for this product' });
        }

        const waitlist = new Waitlist({
            user: req.user?._id,
            email: email || req.user?.email,
            product: productId,
            quantity,
            priority: req.user ? 10 : 0 // Registered users get higher priority
        });

        await waitlist.save();
        await waitlist.populate('product', 'title price images slug');

        res.status(201).json(waitlist);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user's waitlist
// @route   GET /api/waitlist
// @access  Private
const getMyWaitlist = async (req, res) => {
    try {
        const waitlist = await Waitlist.find({
            $or: [
                { user: req.user._id },
                { email: req.user.email }
            ],
            isActive: true
        })
            .populate('product', 'title price images slug stock')
            .sort({ priority: -1, joinedAt: 1 });

        res.json(waitlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Leave waitlist
// @route   DELETE /api/waitlist/:id
// @access  Private
const leaveWaitlist = async (req, res) => {
    try {
        const waitlist = await Waitlist.findById(req.params.id);

        if (!waitlist) {
            return res.status(404).json({ message: 'Waitlist entry not found' });
        }

        if (waitlist.user && waitlist.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        waitlist.isActive = false;
        await waitlist.save();

        res.json({ message: 'Left waitlist' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    joinWaitlist,
    getMyWaitlist,
    leaveWaitlist
};

