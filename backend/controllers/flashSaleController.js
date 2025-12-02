const FlashSale = require('../models/FlashSale');

// @desc    Get active flash sales
// @route   GET /api/flash-sales
// @access  Public
const getActiveFlashSales = async (req, res) => {
    try {
        const now = new Date();

        const flashSales = await FlashSale.find({
            isActive: true,
            startTime: { $lte: now },
            endTime: { $gte: now }
        })
            .populate('products.product', 'title images price')
            .sort({ startTime: -1 });

        res.json(flashSales);
    } catch (error) {
        console.error('Error in getActiveFlashSales:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get upcoming flash sales
// @route   GET /api/flash-sales/upcoming
// @access  Public
const getUpcomingFlashSales = async (req, res) => {
    try {
        const now = new Date();

        const flashSales = await FlashSale.find({
            isActive: true,
            startTime: { $gt: now }
        })
            .populate('products.product', 'title images price')
            .sort({ startTime: 1 })
            .limit(5);

        res.json(flashSales);
    } catch (error) {
        console.error('Error in getUpcomingFlashSales:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get flash sale by ID
// @route   GET /api/flash-sales/:id
// @access  Public
const getFlashSaleById = async (req, res) => {
    try {
        const flashSale = await FlashSale.findById(req.params.id)
            .populate('products.product');

        if (!flashSale) {
            return res.status(404).json({ message: 'Flash sale not found' });
        }

        res.json(flashSale);
    } catch (error) {
        console.error('Error in getFlashSaleById:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create flash sale
// @route   POST /api/flash-sales
// @access  Private/Admin
const createFlashSale = async (req, res) => {
    try {
        const { title, description, products, startTime, endTime, banner } = req.body;

        const flashSale = await FlashSale.create({
            title,
            description,
            products,
            startTime,
            endTime,
            banner
        });

        res.status(201).json(flashSale);
    } catch (error) {
        console.error('Error in createFlashSale:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update flash sale
// @route   PUT /api/flash-sales/:id
// @access  Private/Admin
const updateFlashSale = async (req, res) => {
    try {
        const flashSale = await FlashSale.findById(req.params.id);

        if (!flashSale) {
            return res.status(404).json({ message: 'Flash sale not found' });
        }

        Object.assign(flashSale, req.body);
        await flashSale.save();

        res.json(flashSale);
    } catch (error) {
        console.error('Error in updateFlashSale:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete flash sale
// @route   DELETE /api/flash-sales/:id
// @access  Private/Admin
const deleteFlashSale = async (req, res) => {
    try {
        const flashSale = await FlashSale.findById(req.params.id);

        if (!flashSale) {
            return res.status(404).json({ message: 'Flash sale not found' });
        }

        await flashSale.deleteOne();
        res.json({ message: 'Flash sale deleted' });
    } catch (error) {
        console.error('Error in deleteFlashSale:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Increment sold count for flash sale product
// @route   POST /api/flash-sales/:id/purchase/:productId
// @access  Private
const incrementSoldCount = async (req, res) => {
    try {
        const { id, productId } = req.params;
        const { quantity = 1 } = req.body;

        const flashSale = await FlashSale.findById(id);

        if (!flashSale) {
            return res.status(404).json({ message: 'Flash sale not found' });
        }

        const saleProduct = flashSale.products.find(
            p => p.product.toString() === productId
        );

        if (!saleProduct) {
            return res.status(404).json({ message: 'Product not in flash sale' });
        }

        // Check stock limit
        if (saleProduct.stockLimit &&
            saleProduct.soldCount + quantity > saleProduct.stockLimit) {
            return res.status(400).json({ message: 'Not enough stock in flash sale' });
        }

        saleProduct.soldCount += quantity;
        await flashSale.save();

        res.json({ message: 'Purchase recorded', soldCount: saleProduct.soldCount });
    } catch (error) {
        console.error('Error in incrementSoldCount:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getActiveFlashSales,
    getUpcomingFlashSales,
    getFlashSaleById,
    createFlashSale,
    updateFlashSale,
    deleteFlashSale,
    incrementSoldCount
};
