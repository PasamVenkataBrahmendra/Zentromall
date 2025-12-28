const express = require('express');
const router = express.Router();
const {
    createPriceAlert,
    getMyPriceAlerts,
    deletePriceAlert
} = require('../controllers/priceAlertController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', createPriceAlert);
router.get('/', protect, getMyPriceAlerts);
router.delete('/:id', protect, deletePriceAlert);

module.exports = router;

