const BuyXGetY = require('../models/BuyXGetY');

// @desc    Get active Buy X Get Y offers
// @route   GET /api/buy-x-get-y
// @access  Public
const getOffers = async (req, res) => {
    try {
        const now = new Date();
        const offers = await BuyXGetY.find({
            isActive: true,
            startDate: { $lte: now },
            $or: [{ endDate: null }, { endDate: { $gte: now } }],
            $or: [{ maxUses: null }, { usedCount: { $lt: '$maxUses' } }]
        })
            .populate('buyProduct getProduct buyCategory getCategory')
            .sort({ createdAt: -1 });

        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create Buy X Get Y offer
// @route   POST /api/buy-x-get-y
// @access  Private (Admin)
const createOffer = async (req, res) => {
    try {
        const offer = new BuyXGetY(req.body);
        await offer.save();
        await offer.populate('buyProduct getProduct');

        res.status(201).json(offer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getOffers, createOffer };

