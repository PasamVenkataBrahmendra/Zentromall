/**
 * Payment Routes
 * 
 * Payment processing endpoints for Razorpay and Stripe
 */

const express = require('express');
const router = express.Router();
const razorpayService = require('../services/razorpayService');
const stripeService = require('../services/stripeService');
const { protect } = require('../middleware/authMiddleware');

// Razorpay Routes
router.post('/razorpay/order', razorpayService.createPaymentOrder);
router.post('/razorpay/verify', razorpayService.verifyPayment);
router.post('/razorpay/webhook', express.raw({ type: 'application/json' }), razorpayService.handleWebhook);
router.get('/razorpay/status/:razorpayPaymentId', razorpayService.getPaymentStatus);
router.post('/razorpay/refund', protect, razorpayService.refundPayment);

// Stripe Routes
router.post('/stripe/intent', stripeService.createPaymentIntent);
router.post('/stripe/confirm', stripeService.confirmPaymentIntent);
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), stripeService.handleWebhook);
router.get('/stripe/status/:paymentIntentId', stripeService.getPaymentIntentStatus);
router.post('/stripe/refund', protect, stripeService.refundPayment);
router.post('/stripe/setup-intent', protect, stripeService.createSetupIntent);

module.exports = router;
