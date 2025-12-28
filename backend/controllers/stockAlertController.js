const StockAlert = require('../models/StockAlert');
const Product = require('../models/Product');

// @desc    Create stock alert
// @route   POST /api/stock-alerts
// @access  Public
const createStockAlert = async (req, res) => {
    try {
        const { productId, email } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.stock > 0) {
            return res.status(400).json({ message: 'Product is in stock' });
        }

        // Check if alert already exists
        const existingAlert = await StockAlert.findOne({
            product: productId,
            email: email || req.user?.email,
            isActive: true
        });

        if (existingAlert) {
            return res.status(400).json({ message: 'Alert already exists for this product' });
        }

        const alert = new StockAlert({
            user: req.user?._id,
            email: email || req.user?.email,
            product: productId
        });

        await alert.save();
        await alert.populate('product', 'title price images slug');

        res.status(201).json(alert);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user's stock alerts
// @route   GET /api/stock-alerts
// @access  Private
const getMyStockAlerts = async (req, res) => {
    try {
        const alerts = await StockAlert.find({
            $or: [
                { user: req.user._id },
                { email: req.user.email }
            ],
            isActive: true
        })
            .populate('product', 'title price images slug stock')
            .sort({ createdAt: -1 });

        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete stock alert
// @route   DELETE /api/stock-alerts/:id
// @access  Private
const deleteStockAlert = async (req, res) => {
    try {
        const alert = await StockAlert.findById(req.params.id);

        if (!alert) {
            return res.status(404).json({ message: 'Alert not found' });
        }

        if (alert.user && alert.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        alert.isActive = false;
        await alert.save();

        res.json({ message: 'Stock alert deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createStockAlert,
    getMyStockAlerts,
    deleteStockAlert
};

