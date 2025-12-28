const Subscription = require('../models/Subscription');

// @desc    Create subscription
// @route   POST /api/subscriptions
// @access  Private
const createSubscription = async (req, res) => {
    try {
        const { plan, planName, price, benefits } = req.body;

        const subscription = new Subscription({
            user: req.user._id,
            plan,
            planName,
            price,
            benefits: benefits || [],
            status: 'pending'
        });

        // Calculate end date
        if (plan === 'monthly') {
            subscription.endDate = new Date();
            subscription.endDate.setMonth(subscription.endDate.getMonth() + 1);
            subscription.nextBillingDate = subscription.endDate;
        } else if (plan === 'yearly') {
            subscription.endDate = new Date();
            subscription.endDate.setFullYear(subscription.endDate.getFullYear() + 1);
            subscription.nextBillingDate = subscription.endDate;
        } else if (plan === 'lifetime') {
            subscription.endDate = null;
            subscription.nextBillingDate = null;
        }

        await subscription.save();

        // In production, process payment here
        subscription.status = 'active';
        await subscription.save();

        res.status(201).json(subscription);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user's subscription
// @route   GET /api/subscriptions
// @access  Private
const getMySubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            user: req.user._id,
            status: 'active'
        });

        if (!subscription) {
            return res.json({ subscription: null });
        }

        res.json({ subscription });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel subscription
// @route   POST /api/subscriptions/cancel
// @access  Private
const cancelSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            user: req.user._id,
            status: 'active'
        });

        if (!subscription) {
            return res.status(404).json({ message: 'No active subscription found' });
        }

        subscription.status = 'cancelled';
        subscription.autoRenew = false;
        subscription.cancelledAt = new Date();
        subscription.cancellationReason = req.body.reason || 'User requested';

        await subscription.save();

        res.json({ success: true, message: 'Subscription cancelled' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createSubscription, getMySubscription, cancelSubscription };

