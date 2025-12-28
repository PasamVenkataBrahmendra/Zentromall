const GiftCard = require('../models/GiftCard');
const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Purchase gift card
// @route   POST /api/gift-cards/purchase
// @access  Private
const purchaseGiftCard = async (req, res) => {
    try {
        const { amount, recipientEmail, recipientName, message, expiresInDays = 365 } = req.body;

        if (amount < 10) {
            return res.status(400).json({ message: 'Minimum gift card amount is $10' });
        }

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiresInDays);

        const giftCard = new GiftCard({
            amount,
            balance: amount,
            purchasedBy: req.user._id,
            recipientEmail,
            recipientName,
            message,
            expiresAt
        });

        await giftCard.save();

        // In production, process payment here
        // For now, just return the gift card

        res.status(201).json({
            success: true,
            giftCard: {
                code: giftCard.code,
                amount: giftCard.amount,
                expiresAt: giftCard.expiresAt,
                recipientEmail: giftCard.recipientEmail
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Redeem gift card
// @route   POST /api/gift-cards/redeem
// @access  Private
const redeemGiftCard = async (req, res) => {
    try {
        const { code } = req.body;

        const giftCard = await GiftCard.findOne({ code: code.toUpperCase() });

        if (!giftCard) {
            return res.status(404).json({ message: 'Gift card not found' });
        }

        if (giftCard.status !== 'active') {
            return res.status(400).json({ message: 'Gift card is not active' });
        }

        if (new Date() > giftCard.expiresAt) {
            giftCard.status = 'expired';
            await giftCard.save();
            return res.status(400).json({ message: 'Gift card has expired' });
        }

        if (giftCard.balance <= 0) {
            return res.status(400).json({ message: 'Gift card has no balance' });
        }

        res.json({
            success: true,
            giftCard: {
                code: giftCard.code,
                balance: giftCard.balance
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Apply gift card to order
// @route   POST /api/gift-cards/apply
// @access  Private
const applyGiftCard = async (req, res) => {
    try {
        const { code, orderId } = req.body;

        const giftCard = await GiftCard.findOne({ code: code.toUpperCase() });
        if (!giftCard || giftCard.status !== 'active' || giftCard.balance <= 0) {
            return res.status(400).json({ message: 'Invalid gift card' });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const discountAmount = Math.min(giftCard.balance, order.total);
        giftCard.balance -= discountAmount;
        
        if (giftCard.balance === 0) {
            giftCard.status = 'redeemed';
            giftCard.redeemedAt = new Date();
            giftCard.redeemedBy = req.user._id;
        }

        giftCard.transactions.push({
            type: 'redemption',
            amount: discountAmount,
            orderId: order._id
        });

        await giftCard.save();

        res.json({
            success: true,
            discountAmount,
            remainingBalance: giftCard.balance
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's gift cards
// @route   GET /api/gift-cards/my-cards
// @access  Private
const getMyGiftCards = async (req, res) => {
    try {
        const giftCards = await GiftCard.find({
            $or: [
                { purchasedBy: req.user._id },
                { recipientEmail: req.user.email }
            ]
        }).sort({ createdAt: -1 });

        res.json(giftCards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    purchaseGiftCard,
    redeemGiftCard,
    applyGiftCard,
    getMyGiftCards
};

