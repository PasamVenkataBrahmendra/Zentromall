const DailyDeal = require('../models/DailyDeal');
const Product = require('../models/Product');

// @desc    Get active daily deals
// @route   GET /api/daily-deals
// @access  Public
const getDailyDeals = async (req, res) => {
    try {
        const now = new Date();
        const deals = await DailyDeal.find({
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now }
        })
            .populate('product')
            .sort({ priority: -1, createdAt: -1 });

        res.json(deals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create daily deal
// @route   POST /api/daily-deals
// @access  Private (Admin)
const createDailyDeal = async (req, res) => {
    try {
        const { productId, discountPercentage, startDate, endDate, maxQuantity, priority } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const dealPrice = product.price * (1 - discountPercentage / 100);

        const deal = new DailyDeal({
            product: productId,
            discountPercentage,
            originalPrice: product.price,
            dealPrice,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            maxQuantity,
            priority: priority || 0
        });

        await deal.save();
        await deal.populate('product');

        res.status(201).json(deal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getDailyDeals, createDailyDeal };

