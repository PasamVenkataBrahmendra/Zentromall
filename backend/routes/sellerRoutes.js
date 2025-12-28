const express = require('express');
const router = express.Router();
const { protect, seller } = require('../middleware/authMiddleware');
const { getDashboardStats } = require('../controllers/sellerDashboardController');
const { getInventory, updateStock, bulkUpdateStock } = require('../controllers/inventoryController');
const { getSellerOrders, updateOrderStatus } = require('../controllers/sellerOrderController');
const { getAnalytics } = require('../controllers/sellerAnalyticsController');

// Dashboard
router.get('/dashboard', protect, seller, getDashboardStats);

// Inventory
router.get('/inventory', protect, seller, getInventory);
router.put('/inventory/:productId', protect, seller, updateStock);
router.post('/inventory/bulk-update', protect, seller, bulkUpdateStock);

// Orders
router.get('/orders', protect, seller, getSellerOrders);
router.put('/orders/:orderId/status', protect, seller, updateOrderStatus);

// Analytics
router.get('/analytics', protect, seller, getAnalytics);

module.exports = router;

