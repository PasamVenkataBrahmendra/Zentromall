const Referral = require('../models/Referral');
const User = require('../models/User');
const crypto = require('crypto');

// @desc    Generate referral code
// @route   POST /api/referrals/generate
// @access  Private
const generateReferralCode = async (req, res) => {
    try {
        let code;
        let exists = true;
        
        while (exists) {
            code = crypto.randomBytes(4).toString('hex').toUpperCase();
            const existing = await Referral.findOne({ code, referrer: req.user._id });
            if (!existing) exists = false;
        }

        const referral = new Referral({
            referrer: req.user._id,
            code,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
        });

        await referral.save();

        res.json({ code, referral });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user's referrals
// @route   GET /api/referrals
// @access  Private
const getMyReferrals = async (req, res) => {
    try {
        const referrals = await Referral.find({ referrer: req.user._id })
            .populate('referred', 'name email')
            .sort({ createdAt: -1 });

        res.json(referrals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Apply referral code
// @route   POST /api/referrals/apply
// @access  Public
const applyReferralCode = async (req, res) => {
    try {
        const { code, email } = req.body;

        const referral = await Referral.findOne({ code: code.toUpperCase() });
        if (!referral) {
            return res.status(404).json({ message: 'Invalid referral code' });
        }

        if (referral.status !== 'pending') {
            return res.status(400).json({ message: 'Referral code already used' });
        }

        if (new Date() > referral.expiresAt) {
            referral.status = 'expired';
            await referral.save();
            return res.status(400).json({ message: 'Referral code has expired' });
        }

        referral.referredEmail = email;
        await referral.save();

        res.json({ success: true, message: 'Referral code applied' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { generateReferralCode, getMyReferrals, applyReferralCode };

