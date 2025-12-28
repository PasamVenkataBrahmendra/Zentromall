const PriceAlert = require('../models/PriceAlert');
const Product = require('../models/Product');

// @desc    Create price alert
// @route   POST /api/price-alerts
// @access  Public
const createPriceAlert = async (req, res) => {
    try {
        const { productId, targetPrice, email } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (targetPrice >= product.price) {
            return res.status(400).json({ message: 'Target price must be less than current price' });
        }

        const alert = new PriceAlert({
            user: req.user?._id,
            email: email || req.user?.email,
            product: productId,
            targetPrice,
            currentPrice: product.price
        });

        await alert.save();
        await alert.populate('product', 'title price images');

        res.status(201).json(alert);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user's price alerts
// @route   GET /api/price-alerts
// @access  Private
const getMyPriceAlerts = async (req, res) => {
    try {
        const alerts = await PriceAlert.find({
            $or: [
                { user: req.user._id },
                { email: req.user.email }
            ],
            isActive: true
        })
            .populate('product', 'title price images slug')
            .sort({ createdAt: -1 });

        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete price alert
// @route   DELETE /api/price-alerts/:id
// @access  Private
const deletePriceAlert = async (req, res) => {
    try {
        const alert = await PriceAlert.findById(req.params.id);

        if (!alert) {
            return res.status(404).json({ message: 'Alert not found' });
        }

        if (alert.user && alert.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        alert.isActive = false;
        await alert.save();

        res.json({ message: 'Price alert deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPriceAlert,
    getMyPriceAlerts,
    deletePriceAlert
};

