/**
 * Checkout Routes
 * 
 * Multi-step checkout endpoints
 */

const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const { protect } = require('../middleware/authMiddleware');

// Initialize checkout session
router.post('/initialize/:userId', protect, checkoutController.initializeCheckout);

// Get checkout session details
router.get('/:sessionId', checkoutController.getCheckout);

// Step 1: Set shipping address
router.post('/:sessionId/address', checkoutController.setShippingAddress);

// Step 2: Set shipping method
router.post('/:sessionId/shipping', checkoutController.setShippingMethod);

// Step 3: Set payment method
router.post('/:sessionId/payment', checkoutController.setPaymentMethod);

// Step 4: Get order summary (review)
router.get('/:sessionId/summary', checkoutController.getOrderSummary);

// Step 5: Complete checkout & create order
router.post('/:sessionId/complete', protect, checkoutController.completeCheckout);

// Apply coupon
router.post('/:sessionId/coupon', checkoutController.applyCoupon);

// Get available shipping methods
router.get('/methods/shipping', checkoutController.getShippingMethods);

// Abandon checkout
router.post('/:sessionId/abandon', checkoutController.abandonCheckout);

module.exports = router;
