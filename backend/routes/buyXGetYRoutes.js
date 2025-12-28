const express = require('express');
const router = express.Router();
const { getOffers, createOffer } = require('../controllers/buyXGetYController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getOffers);
router.post('/', protect, admin, createOffer);

module.exports = router;

