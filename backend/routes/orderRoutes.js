const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus, getSellerOrders, getOrderById } = require('../controllers/orderController');
const { protect, admin, seller } = require('../middleware/authMiddleware');

router.route('/').post(protect, createOrder).get(protect, admin, getAllOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/sellerorders').get(protect, seller, getSellerOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/:id').get(protect, getOrderById);

module.exports = router;
