const BundleOffer = require('../models/BundleOffer');
const Product = require('../models/Product');

// @desc    Get active bundle offers
// @route   GET /api/bundles
// @access  Public
const getBundles = async (req, res) => {
    try {
        const now = new Date();
        const bundles = await BundleOffer.find({
            isActive: true,
            startDate: { $lte: now },
            $or: [{ endDate: null }, { endDate: { $gte: now } }]
        })
            .populate('products')
            .sort({ createdAt: -1 });

        res.json(bundles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create bundle offer
// @route   POST /api/bundles
// @access  Private (Admin)
const createBundle = async (req, res) => {
    try {
        const bundle = new BundleOffer(req.body);
        
        // Calculate original total
        const products = await Product.find({ _id: { $in: bundle.products } });
        bundle.originalTotal = products.reduce((sum, p) => sum + p.price, 0);
        
        // Calculate discount percentage
        bundle.discountPercentage = ((bundle.originalTotal - bundle.bundlePrice) / bundle.originalTotal) * 100;

        await bundle.save();
        await bundle.populate('products');

        res.status(201).json(bundle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getBundles, createBundle };

