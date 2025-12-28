const PreOrder = require('../models/PreOrder');
const Product = require('../models/Product');

// @desc    Create pre-order
// @route   POST /api/pre-orders
// @access  Private
const createPreOrder = async (req, res) => {
    try {
        const { productId, quantity, shippingAddress, paymentAmount } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if product has expected release date
        if (!product.expectedReleaseDate) {
            return res.status(400).json({ message: 'Product does not support pre-orders' });
        }

        const preOrder = new PreOrder({
            user: req.user._id,
            product: productId,
            quantity,
            price: product.price,
            expectedReleaseDate: product.expectedReleaseDate,
            shippingAddress,
            paymentAmount: paymentAmount || 0,
            paymentStatus: paymentAmount > 0 ? 'partial' : 'pending'
        });

        await preOrder.save();
        await preOrder.populate('product', 'title images slug');

        res.status(201).json(preOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user's pre-orders
// @route   GET /api/pre-orders
// @access  Private
const getMyPreOrders = async (req, res) => {
    try {
        const preOrders = await PreOrder.find({ user: req.user._id })
            .populate('product', 'title images slug price')
            .sort({ createdAt: -1 });

        res.json(preOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPreOrder, getMyPreOrders };

