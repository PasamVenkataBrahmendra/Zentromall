const express = require('express');
const router = express.Router();
const {
    getActiveFlashSales,
    getUpcomingFlashSales,
    getFlashSaleById,
    createFlashSale,
    updateFlashSale,
    deleteFlashSale,
    incrementSoldCount
} = require('../controllers/flashSaleController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getActiveFlashSales)
    .post(protect, admin, createFlashSale);

router.get('/upcoming', getUpcomingFlashSales);

router.route('/:id')
    .get(getFlashSaleById)
    .put(protect, admin, updateFlashSale)
    .delete(protect, admin, deleteFlashSale);

router.post('/:id/purchase/:productId', protect, incrementSoldCount);

module.exports = router;
