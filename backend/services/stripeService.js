/**
 * Stripe Payment Gateway
 * 
 * Handles payment processing with Stripe
 * - Create payment intents
 * - Verify payments
 * - Handle webhooks
 */

const Stripe = require('stripe');
const Checkout = require('../models/Checkout');
const Order = require('../models/Order');

// Initialize Stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create Payment Intent
 * Called when user proceeds to payment
 */
exports.createPaymentIntent = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const checkout = await Checkout.findOne({ sessionId });
    if (!checkout) {
      return res.status(404).json({ error: 'Checkout session not found' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(checkout.pricing.total * 100), // Amount in cents
      currency: 'inr',
      payment_method_types: ['card', 'upi'],
      description: `ZentroMall Order - ${checkout.sessionId}`,
      metadata: {
        checkoutSessionId: checkout.sessionId,
        userId: checkout.user.toString(),
        orderItems: checkout.cart.length,
        shippingMethod: checkout.shippingMethod.method
      },
      receipt_email: checkout.user.email || undefined,
      automatic_payment_methods: {
        enabled: true
      }
    });

    // Save payment intent to checkout
    checkout.paymentMethod.details.stripePaymentIntentId = paymentIntent.id;
    checkout.paymentMethod.details.stripeClientSecret = paymentIntent.client_secret;
    checkout.paymentStatus = 'pending';
    checkout.status = 'payment_processing';
    await checkout.save();

    res.json({
      success: true,
      payment: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: checkout.pricing.total,
        currency: 'INR'
      }
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};

/**
 * Confirm Payment Intent
 * Called after frontend confirms payment
 */
exports.confirmPaymentIntent = async (req, res) => {
  try {
    const { sessionId, paymentMethodId } = req.body;

    const checkout = await Checkout.findOne({ sessionId });
    if (!checkout) {
      return res.status(404).json({ error: 'Checkout session not found' });
    }

    const paymentIntentId = checkout.paymentMethod.details.stripePaymentIntentId;

    // Confirm payment intent
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
      return_url: `${process.env.FRONTEND_URL}/payment-success`
    });

    // Handle different payment intent statuses
    if (paymentIntent.status === 'succeeded') {
      checkout.paymentStatus = 'success';
      checkout.status = 'payment_success';
      checkout.paymentMethod.details.stripePaymentIntentId = paymentIntent.id;

      // Save card details if available
      if (paymentIntent.payment_method) {
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);
        if (paymentMethod.card) {
          checkout.paymentMethod.details.cardLast4 = paymentMethod.card.last4;
          checkout.paymentMethod.details.cardBrand = paymentMethod.card.brand;
        } else if (paymentMethod.upi) {
          checkout.paymentMethod.details.upiId = paymentMethod.upi.id;
        }
      }

      await checkout.save();

      return res.json({
        success: true,
        message: 'Payment successful',
        status: 'succeeded'
      });
    } else if (paymentIntent.status === 'requires_action') {
      // Payment requires additional action (3D Secure, etc.)
      return res.json({
        success: false,
        status: 'requires_action',
        clientSecret: paymentIntent.client_secret
      });
    } else if (paymentIntent.status === 'requires_payment_method') {
      checkout.paymentStatus = 'failed';
      checkout.addError(3, 'Payment requires payment method', 'PAYMENT_METHOD_REQUIRED');
      await checkout.save();

      return res.status(400).json({
        success: false,
        error: 'Payment method required'
      });
    } else {
      checkout.paymentStatus = 'failed';
      checkout.addError(3, `Payment intent status: ${paymentIntent.status}`, 'PAYMENT_FAILED');
      await checkout.save();

      return res.status(400).json({
        success: false,
        error: 'Payment failed'
      });
    }
  } catch (error) {
    console.error('Confirm payment intent error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
};

/**
 * Get Payment Intent Status
 */
exports.getPaymentIntentStatus = async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.json({
      success: true,
      payment: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        created: new Date(paymentIntent.created * 1000)
      }
    });
  } catch (error) {
    console.error('Get payment intent status error:', error);
    res.status(500).json({ error: 'Failed to get payment status' });
  }
};

/**
 * Handle Stripe Webhook
 * Receives payment status updates from Stripe
 */
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed:`, err.message);
    return res.sendStatus(400);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

/**
 * Refund Payment
 */
exports.refundPayment = async (req, res) => {
  try {
    const { paymentIntentId, reason, amount } = req.body;

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason,
      amount: amount ? Math.round(amount * 100) : undefined,
      metadata: {
        reason
      }
    });

    res.json({
      success: true,
      refund: {
        id: refund.id,
        paymentIntentId: refund.payment_intent,
        amount: refund.amount / 100,
        status: refund.status,
        createdAt: new Date(refund.created * 1000)
      }
    });
  } catch (error) {
    console.error('Refund payment error:', error);
    res.status(500).json({ error: 'Failed to refund payment' });
  }
};

/**
 * Create Setup Intent (for saving cards)
 */
exports.createSetupIntent = async (req, res) => {
  try {
    const setupIntent = await stripe.setupIntents.create({
      payment_method_types: ['card']
    });

    res.json({
      success: true,
      setupIntent: {
        id: setupIntent.id,
        clientSecret: setupIntent.client_secret
      }
    });
  } catch (error) {
    console.error('Create setup intent error:', error);
    res.status(500).json({ error: 'Failed to create setup intent' });
  }
};

// Helper functions for webhook events

async function handlePaymentIntentSucceeded(paymentIntent) {
  try {
    console.log(`Payment succeeded: ${paymentIntent.id}`);

    const checkout = await Checkout.findOne({
      'paymentMethod.details.stripePaymentIntentId': paymentIntent.id
    });

    if (checkout) {
      checkout.paymentStatus = 'success';
      checkout.status = 'payment_success';

      // Save payment method details
      if (paymentIntent.payment_method) {
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);
        if (paymentMethod.card) {
          checkout.paymentMethod.details.cardLast4 = paymentMethod.card.last4;
          checkout.paymentMethod.details.cardBrand = paymentMethod.card.brand;
        } else if (paymentMethod.upi) {
          checkout.paymentMethod.details.upiId = paymentMethod.upi.id;
        }
      }

      await checkout.save();
    }
  } catch (error) {
    console.error('Handle payment intent succeeded error:', error);
  }
}

async function handlePaymentIntentFailed(paymentIntent) {
  try {
    console.log(`Payment failed: ${paymentIntent.id}`);

    const checkout = await Checkout.findOne({
      'paymentMethod.details.stripePaymentIntentId': paymentIntent.id
    });

    if (checkout) {
      checkout.paymentStatus = 'failed';
      checkout.addError(
        3,
        paymentIntent.last_payment_error?.message || 'Payment failed',
        'PAYMENT_FAILED'
      );
      await checkout.save();
    }
  } catch (error) {
    console.error('Handle payment intent failed error:', error);
  }
}

async function handleChargeRefunded(charge) {
  try {
    console.log(`Charge refunded: ${charge.id}`);

    const order = await Order.findOne({
      'paymentDetails.stripePaymentIntentId': charge.payment_intent
    });

    if (order) {
      order.orderStatus = 'refunded';
      order.refund = {
        chargeId: charge.id,
        amount: charge.amount_refunded / 100,
        status: 'completed',
        createdAt: new Date(charge.created * 1000)
      };
      await order.save();
    }
  } catch (error) {
    console.error('Handle charge refunded error:', error);
  }
}

module.exports = exports;
