const Product = require('../models/Product');

// @desc    Get inventory list
// @route   GET /api/seller/inventory
// @access  Private (Seller)
const getInventory = async (req, res) => {
    try {
        const { page = 1, limit = 20, lowStock = false } = req.query;
        const skip = (page - 1) * limit;

        let query = { seller: req.user._id };
        if (lowStock === 'true') {
            query.stock = { $lt: 10 };
        }

        const products = await Product.find(query)
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Product.countDocuments(query);

        res.json({
            products,
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

// @desc    Update product stock
// @route   PUT /api/seller/inventory/:productId
// @access  Private (Seller)
const updateStock = async (req, res) => {
    try {
        const { productId } = req.params;
        const { stock, operation } = req.body; // operation: 'set', 'add', 'subtract'

        const product = await Product.findOne({ _id: productId, seller: req.user._id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (operation === 'add') {
            product.stock += stock;
        } else if (operation === 'subtract') {
            product.stock = Math.max(0, product.stock - stock);
        } else {
            product.stock = stock;
        }

        await product.save();

        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Bulk update stock
// @route   POST /api/seller/inventory/bulk-update
// @access  Private (Seller)
const bulkUpdateStock = async (req, res) => {
    try {
        const { updates } = req.body; // [{ productId, stock }]

        const results = [];
        for (const update of updates) {
            const product = await Product.findOne({ _id: update.productId, seller: req.user._id });
            if (product) {
                product.stock = update.stock;
                await product.save();
                results.push({ productId: update.productId, success: true });
            } else {
                results.push({ productId: update.productId, success: false, error: 'Product not found' });
            }
        }

        res.json({ results });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getInventory, updateStock, bulkUpdateStock };

