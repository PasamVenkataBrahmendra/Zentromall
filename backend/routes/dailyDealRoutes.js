const express = require('express');
const router = express.Router();
const { getDailyDeals, createDailyDeal } = require('../controllers/dailyDealController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getDailyDeals);
router.post('/', protect, admin, createDailyDeal);

module.exports = router;

