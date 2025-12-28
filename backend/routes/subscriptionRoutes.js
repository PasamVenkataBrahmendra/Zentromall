const express = require('express');
const router = express.Router();
const { createSubscription, getMySubscription, cancelSubscription } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createSubscription);
router.get('/', protect, getMySubscription);
router.post('/cancel', protect, cancelSubscription);

module.exports = router;

