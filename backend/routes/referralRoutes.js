const express = require('express');
const router = express.Router();
const { generateReferralCode, getMyReferrals, applyReferralCode } = require('../controllers/referralController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateReferralCode);
router.get('/', protect, getMyReferrals);
router.post('/apply', applyReferralCode);

module.exports = router;

