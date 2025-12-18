/**
 * Razorpay Payment Gateway
 * 
 * Handles payment processing with Razorpay
 * - Create payment orders
 * - Verify payments
 * - Handle webhooks
 */

const Razorpay = require('razorpay');
const crypto = require('crypto');
const Checkout = require('../models/Checkout');
const Order = require('../models/Order');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * Create Razorpay Order
 * Called when user proceeds to payment
 */
exports.createPaymentOrder = async (req, res) => {
  try {
    const { sessionId, paymentMethod } = req.body;

    const checkout = await Checkout.findOne({ sessionId });
    if (!checkout) {
      return res.status(404).json({ error: 'Checkout session not found' });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(checkout.pricing.total * 100), // Amount in paise
      currency: 'INR',
      receipt: `receipt_${checkout.sessionId}`,
      payment_capture: 1, // Auto-capture payment
      description: `Order from ZentroMall - ${checkout.sessionId}`,
      customer_notify: 1,
      notes: {
        checkoutSessionId: checkout.sessionId,
        userId: checkout.user.toString(),
        orderItems: checkout.cart.length,
        shippingMethod: checkout.shippingMethod.method
      }
    };

    const order = await razorpay.orders.create(options);

    // Save Razorpay order ID to checkout
    checkout.paymentMethod.details.razorpayOrderId = order.id;
    checkout.paymentStatus = 'pending';
    checkout.status = 'payment_processing';
    await checkout.save();

    res.json({
      success: true,
      payment: {
        orderId: order.id,
        amount: checkout.pricing.total,
        currency: 'INR',
        key: process.env.RAZORPAY_KEY_ID,
        description: options.description,
        name: 'ZentroMall',
        prefill: {
          email: checkout.user.email || '',
          contact: checkout.shippingAddress.phone || '',
          name: checkout.shippingAddress.fullName || ''
        }
      }
    });
  } catch (error) {
    console.error('Create Razorpay order error:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
};

/**
 * Verify Payment
 * Called after successful payment on frontend
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { sessionId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    const checkout = await Checkout.findOne({ sessionId });
    if (!checkout) {
      return res.status(404).json({ error: 'Checkout session not found' });
    }

    // Verify signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isValidSignature = expectedSignature === razorpaySignature;

    if (!isValidSignature) {
      checkout.paymentStatus = 'failed';
      checkout.addError(3, 'Payment signature verification failed', 'INVALID_SIGNATURE');
      await checkout.save();
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpayPaymentId);

    if (payment.status !== 'captured') {
      checkout.paymentStatus = 'failed';
      checkout.addError(3, `Payment status: ${payment.status}`, 'PAYMENT_FAILED');
      await checkout.save();
      return res.status(400).json({ error: `Payment failed with status: ${payment.status}` });
    }

    // Update checkout with payment details
    checkout.paymentMethod.details.razorpayPaymentId = razorpayPaymentId;
    checkout.paymentMethod.details.razorpaySignature = razorpaySignature;
    checkout.paymentStatus = 'success';
    checkout.status = 'payment_success';

    // Save card details if available
    if (payment.vpa) {
      checkout.paymentMethod.details.upiId = payment.vpa;
    } else if (payment.card_id) {
      const card = payment.card;
      checkout.paymentMethod.details.cardLast4 = card.last4;
      checkout.paymentMethod.details.cardBrand = card.network;
    }

    await checkout.save();

    res.json({
      success: true,
      message: 'Payment verified successfully',
      checkoutSessionId: checkout.sessionId,
      paymentId: razorpayPaymentId
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};

/**
 * Handle Razorpay Webhook
 * Receives payment status updates from Razorpay
 */
exports.handleWebhook = async (req, res) => {
  try {
    const signature = req.get('X-Razorpay-Signature');
    const body = JSON.stringify(req.body);

    // Verify webhook signature
    const hash = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    const event = req.body;

    switch (event.event) {
      case 'payment.authorized':
        await handlePaymentAuthorized(event.payload.payment.entity);
        break;

      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;

      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;

      case 'refund.created':
        await handleRefund(event.payload.refund.entity);
        break;

      default:
        console.log(`Unhandled event: ${event.event}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

/**
 * Get Payment Status
 * Check status of a payment
 */
exports.getPaymentStatus = async (req, res) => {
  try {
    const { razorpayPaymentId } = req.params;

    const payment = await razorpay.payments.fetch(razorpayPaymentId);

    res.json({
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        description: payment.description,
        createdAt: new Date(payment.created_at * 1000)
      }
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ error: 'Failed to get payment status' });
  }
};

/**
 * Refund Payment
 * Initiate refund for a payment
 */
exports.refundPayment = async (req, res) => {
  try {
    const { razorpayPaymentId, reason, notes } = req.body;

    const refund = await razorpay.payments.refund(razorpayPaymentId, {
      amount: null, // Full refund
      reason,
      notes
    });

    res.json({
      success: true,
      refund: {
        id: refund.id,
        paymentId: refund.payment_id,
        amount: refund.amount,
        status: refund.status,
        createdAt: new Date(refund.created_at * 1000)
      }
    });
  } catch (error) {
    console.error('Refund payment error:', error);
    res.status(500).json({ error: 'Failed to refund payment' });
  }
};

// Helper functions for webhook events

async function handlePaymentAuthorized(payment) {
  try {
    console.log(`Payment authorized: ${payment.id}`);
    // Update checkout status if needed
  } catch (error) {
    console.error('Handle payment authorized error:', error);
  }
}

async function handlePaymentFailed(payment) {
  try {
    console.log(`Payment failed: ${payment.id}`);
    
    const checkout = await Checkout.findOne({
      'paymentMethod.details.razorpayPaymentId': payment.id
    });

    if (checkout) {
      checkout.paymentStatus = 'failed';
      checkout.addError(3, payment.description || 'Payment failed', 'PAYMENT_FAILED');
      await checkout.save();
    }
  } catch (error) {
    console.error('Handle payment failed error:', error);
  }
}

async function handlePaymentCaptured(payment) {
  try {
    console.log(`Payment captured: ${payment.id}`);
    
    const checkout = await Checkout.findOne({
      'paymentMethod.details.razorpayOrderId': payment.order_id
    });

    if (checkout && checkout.paymentStatus !== 'success') {
      checkout.paymentStatus = 'success';
      checkout.status = 'payment_success';
      checkout.paymentMethod.details.razorpayPaymentId = payment.id;
      await checkout.save();
    }
  } catch (error) {
    console.error('Handle payment captured error:', error);
  }
}

async function handleRefund(refund) {
  try {
    console.log(`Refund created: ${refund.id}`);
    
    const order = await Order.findOne({
      'paymentDetails.razorpayPaymentId': refund.payment_id
    });

    if (order) {
      order.orderStatus = 'refunded';
      order.refund = {
        refundId: refund.id,
        amount: refund.amount,
        status: refund.status,
        createdAt: new Date(refund.created_at * 1000)
      };
      await order.save();
    }
  } catch (error) {
    console.error('Handle refund error:', error);
  }
}

module.exports = exports;
