const express = require('express');
const router = express.Router();
const {
    createStockAlert,
    getMyStockAlerts,
    deleteStockAlert
} = require('../controllers/stockAlertController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', createStockAlert);
router.get('/', protect, getMyStockAlerts);
router.delete('/:id', protect, deleteStockAlert);

module.exports = router;

