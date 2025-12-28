const SizeGuide = require('../models/SizeGuide');
const Product = require('../models/Product');

// @desc    Get size guide for a product
// @route   GET /api/size-guide/product/:productId
// @access  Public
const getProductSizeGuide = async (req, res) => {
    try {
        const { productId } = req.params;
        const sizeGuide = await SizeGuide.findOne({ product: productId, isActive: true })
            .populate('product', 'title slug category');

        if (!sizeGuide) {
            // Try to get category-based size guide
            const product = await Product.findById(productId).select('category');
            if (product?.category) {
                const categorySizeGuide = await SizeGuide.findOne({
                    category: product.category,
                    isActive: true
                });
                if (categorySizeGuide) {
                    return res.json(categorySizeGuide);
                }
            }
            return res.status(404).json({ message: 'Size guide not found' });
        }

        res.json(sizeGuide);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create or update size guide
// @route   POST /api/size-guide
// @access  Private (Seller/Admin)
const createSizeGuide = async (req, res) => {
    try {
        const { productId, ...sizeGuideData } = req.body;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if size guide exists
        let sizeGuide = await SizeGuide.findOne({ product: productId });

        if (sizeGuide) {
            // Update existing
            Object.assign(sizeGuide, sizeGuideData);
            await sizeGuide.save();
        } else {
            // Create new
            sizeGuide = new SizeGuide({
                ...sizeGuideData,
                product: productId,
                category: product.category
            });
            await sizeGuide.save();
        }

        res.status(201).json(sizeGuide);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get size guide by category
// @route   GET /api/size-guide/category/:categoryId
// @access  Public
const getCategorySizeGuide = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const sizeGuide = await SizeGuide.findOne({ category: categoryId, isActive: true });

        if (!sizeGuide) {
            return res.status(404).json({ message: 'Size guide not found for this category' });
        }

        res.json(sizeGuide);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProductSizeGuide,
    createSizeGuide,
    getCategorySizeGuide
};

