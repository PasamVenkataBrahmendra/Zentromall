/**
 * Checkout Controller
 * 
 * Handles multi-step checkout process:
 * - Initialize checkout session
 * - Update each step (address, shipping, payment)
 * - Process payments
 * - Create orders
 */

const Checkout = require('../models/Checkout');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const orderCalculator = require('../utils/orderCalculator');
const crypto = require('crypto');

// Initialize Checkout Session
exports.initializeCheckout = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate pricing
    const subtotal = orderCalculator.calculateSubtotal(cart.items);
    const tax = orderCalculator.calculateTax(subtotal);
    const shipping = orderCalculator.calculateShipping(subtotal);
    const total = orderCalculator.calculateTotal(subtotal, tax, shipping);

    // Create checkout session
    const sessionId = crypto.randomBytes(16).toString('hex');

    const checkout = new Checkout({
      user: userId,
      sessionId,
      currentStep: 1,
      status: 'initiated',
      cart: cart.items.map(item => ({
        productId: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
        discount: item.product.discount || 0,
        subtotal: item.product.price * item.quantity
      })),
      pricing: {
        subtotal,
        tax,
        shipping,
        total
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    await checkout.save();

    res.status(201).json({
      success: true,
      checkout: {
        sessionId: checkout.sessionId,
        currentStep: checkout.currentStep,
        status: checkout.status,
        pricing: checkout.pricing,
        expiresAt: checkout.expiresAt
      }
    });
  } catch (error) {
    console.error('Initialize checkout error:', error);
    res.status(500).json({ error: 'Failed to initialize checkout' });
  }
};

// Get Checkout Session
exports.getCheckout = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const checkout = await Checkout.findOne({ sessionId });
    if (!checkout) {
      return res.status(404).json({ error: 'Checkout session not found' });
    }

    // Check if expired
    if (new Date() > checkout.expiresAt) {
      checkout.status = 'expired';
      await checkout.save();
      return res.status(400).json({ error: 'Checkout session expired' });
    }

    res.json({
      success: true,
      checkout: {
        sessionId: checkout.sessionId,
        currentStep: checkout.currentStep,
        completedSteps: checkout.completedSteps,
        status: checkout.status,
        shippingAddress: checkout.shippingAddress,
        shippingMethod: checkout.shippingMethod,
        paymentMethod: checkout.paymentMethod,
        pricing: checkout.pricing,
        coupon: checkout.coupon,
        paymentStatus: checkout.paymentStatus,
        expiresAt: checkout.expiresAt
      }
    });
  } catch (error) {
    console.error('Get checkout error:', error);
    res.status(500).json({ error: 'Failed to get checkout' });
  }
};

// Step 1: Set Shipping Address
exports.setShippingAddress = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const addressData = req.body;

    const checkout = await Checkout.findOne({ sessionId });
    if (!checkout) {
      return res.status(404).json({ error: 'Checkout session not found' });
    }

    // Validate address
    const requiredFields = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'zipCode'];
    for (const field of requiredFields) {
      if (!addressData[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    // Validate phone (10 digits)
    if (!/^\d{10}$/.test(addressData.phone)) {
      return res.status(400).json({ error: 'Phone must be 10 digits' });
    }

    // Validate zip code (6 digits)
    if (!/^\d{6}$/.test(addressData.zipCode)) {
      return res.status(400).json({ error: 'Zip code must be 6 digits' });
    }

    // Set address
    checkout.shippingAddress = {
      ...addressData,
      country: addressData.country || 'India'
    };
    checkout.currentStep = 2;
    checkout.markStepComplete(1);
    checkout.status = 'address_set';

    await checkout.save();

    res.json({
      success: true,
      message: 'Shipping address set successfully',
      checkout: {
        currentStep: checkout.currentStep,
        completedSteps: checkout.completedSteps,
        status: checkout.status,
        shippingAddress: checkout.shippingAddress
      }
    });
  } catch (error) {
    console.error('Set shipping address error:', error);
    res.status(500).json({ error: 'Failed to set shipping address' });
  }
};

// Step 2: Set Shipping Method
exports.setShippingMethod = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { method } = req.body;

    const checkout = await Checkout.findOne({ sessionId });
    if (!checkout) {
      return res.status(404).json({ error: 'Checkout session not found' });
    }

    // Validate method
    const shippingMethods = {
      standard: { cost: 50, estimatedDays: 5, carrier: 'Standard Delivery' },
      express: { cost: 100, estimatedDays: 2, carrier: 'Express Delivery' },
      overnight: { cost: 200, estimatedDays: 1, carrier: 'Overnight Delivery' }
    };

    if (!shippingMethods[method]) {
      return res.status(400).json({ error: 'Invalid shipping method' });
    }

    // Check free shipping threshold
    const methodData = shippingMethods[method];
    let cost = methodData.cost;

    if (checkout.pricing.subtotal >= 500 && method === 'standard') {
      cost = 0; // Free shipping
    }

    // Update pricing
    checkout.shippingMethod = {
      method,
      cost,
      estimatedDays: methodData.estimatedDays,
      carrier: methodData.carrier
    };

    // Recalculate total
    checkout.pricing.shipping = cost;
    checkout.pricing.total = orderCalculator.calculateTotal(
      checkout.pricing.subtotal,
      checkout.pricing.tax,
      checkout.pricing.shipping
    );

    checkout.currentStep = 3;
    checkout.markStepComplete(2);
    checkout.status = 'shipping_set';

    await checkout.save();

    res.json({
      success: true,
      message: 'Shipping method set successfully',
      checkout: {
        currentStep: checkout.currentStep,
        completedSteps: checkout.completedSteps,
        status: checkout.status,
        shippingMethod: checkout.shippingMethod,
        pricing: checkout.pricing
      }
    });
  } catch (error) {
    console.error('Set shipping method error:', error);
    res.status(500).json({ error: 'Failed to set shipping method' });
  }
};

// Step 3: Set Payment Method & Create Payment Intent
exports.setPaymentMethod = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { type, gateway, details } = req.body;

    const checkout = await Checkout.findOne({ sessionId });
    if (!checkout) {
      return res.status(404).json({ error: 'Checkout session not found' });
    }

    // Validate payment method
    const validPaymentTypes = ['credit_card', 'debit_card', 'upi', 'razorpay', 'stripe', 'wallet', 'cod'];
    const validGateways = ['razorpay', 'stripe', 'native', 'cod'];

    if (!validPaymentTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid payment type' });
    }

    if (!validGateways.includes(gateway)) {
      return res.status(400).json({ error: 'Invalid payment gateway' });
    }

    // Set payment method
    checkout.paymentMethod = {
      type,
      gateway,
      details: details || {}
    };

    checkout.currentStep = 4;
    checkout.markStepComplete(3);
    checkout.status = 'payment_pending';

    await checkout.save();

    res.json({
      success: true,
      message: 'Payment method set successfully',
      checkout: {
        currentStep: checkout.currentStep,
        completedSteps: checkout.completedSteps,
        status: checkout.status,
        paymentMethod: checkout.paymentMethod
      }
    });
  } catch (error) {
    console.error('Set payment method error:', error);
    res.status(500).json({ error: 'Failed to set payment method' });
  }
};

// Step 4: Get Order Summary (for review)
exports.getOrderSummary = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const checkout = await Checkout.findOne({ sessionId })
      .populate('cart.productId', 'name image price');

    if (!checkout) {
      return res.status(404).json({ error: 'Checkout session not found' });
    }

    res.json({
      success: true,
      summary: {
        items: checkout.cart,
        shippingAddress: checkout.shippingAddress,
        shippingMethod: checkout.shippingMethod,
        paymentMethod: {
          type: checkout.paymentMethod.type,
          gateway: checkout.paymentMethod.gateway
        },
        pricing: checkout.pricing,
        estimatedDelivery: new Date(Date.now() + checkout.shippingMethod.estimatedDays * 24 * 60 * 60 * 1000)
      }
    });
  } catch (error) {
    console.error('Get order summary error:', error);
    res.status(500).json({ error: 'Failed to get order summary' });
  }
};

// Step 5: Complete Checkout & Create Order
exports.completeCheckout = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const checkout = await Checkout.findOne({ sessionId });
    if (!checkout) {
      return res.status(404).json({ error: 'Checkout session not found' });
    }

    // Validate all steps completed
    const validation = checkout.validateCheckoutData();
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Checkout validation failed',
        details: validation.errors
      });
    }

    // Create Order from Checkout
    const order = new Order({
      user: checkout.user,
      items: checkout.cart,
      shippingAddress: checkout.shippingAddress,
      paymentMethod: checkout.paymentMethod.type,
      paymentDetails: checkout.paymentMethod.details,
      subtotal: checkout.pricing.subtotal,
      discount: checkout.pricing.discount,
      tax: checkout.pricing.tax,
      shippingCost: checkout.pricing.shipping,
      total: checkout.pricing.total,
      couponCode: checkout.coupon?.code,
      orderStatus: 'confirmed',
      estimatedDeliveryDate: new Date(
        Date.now() + checkout.shippingMethod.estimatedDays * 24 * 60 * 60 * 1000
      )
    });

    await order.save();

    // Link order to checkout
    checkout.orderId = order._id;
    checkout.currentStep = 5;
    checkout.markStepComplete(4);
    checkout.markStepComplete(5);
    checkout.status = 'order_created';
    checkout.completedAt = new Date();

    await checkout.save();

    // Clear cart
    await Cart.findOneAndDelete({ user: checkout.user });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.orderStatus,
        estimatedDeliveryDate: order.estimatedDeliveryDate
      }
    });
  } catch (error) {
    console.error('Complete checkout error:', error);
    res.status(500).json({ error: 'Failed to complete checkout' });
  }
};

// Apply Coupon
exports.applyCoupon = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { code } = req.body;

    const checkout = await Checkout.findOne({ sessionId });
    if (!checkout) {
      return res.status(404).json({ error: 'Checkout session not found' });
    }

    // Validate coupon using orderCalculator
    const coupon = await orderCalculator.validateCoupon(code);
    if (!coupon) {
      return res.status(400).json({ error: 'Invalid or expired coupon' });
    }

    // Calculate discount
    let discountAmount = (checkout.pricing.subtotal * coupon.discountPercentage) / 100;
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }

    // Update pricing
    checkout.coupon = {
      code,
      discountAmount,
      discountPercentage: coupon.discountPercentage,
      maxDiscount: coupon.maxDiscount
    };

    checkout.pricing.discount = discountAmount;
    checkout.pricing.total = orderCalculator.calculateTotal(
      checkout.pricing.subtotal,
      checkout.pricing.tax,
      checkout.pricing.shipping,
      discountAmount
    );

    await checkout.save();

    res.json({
      success: true,
      message: 'Coupon applied successfully',
      discount: discountAmount,
      pricing: checkout.pricing
    });
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({ error: 'Failed to apply coupon' });
  }
};

// Get available shipping methods
exports.getShippingMethods = async (req, res) => {
  try {
    const methods = [
      {
        method: 'standard',
        name: 'Standard Delivery',
        cost: 50,
        estimatedDays: 5,
        description: 'Delivery in 5 business days'
      },
      {
        method: 'express',
        name: 'Express Delivery',
        cost: 100,
        estimatedDays: 2,
        description: 'Delivery in 2 business days'
      },
      {
        method: 'overnight',
        name: 'Overnight Delivery',
        cost: 200,
        estimatedDays: 1,
        description: 'Delivery next business day'
      }
    ];

    // Apply free shipping discount if applicable
    const subtotal = req.query.subtotal ? parseFloat(req.query.subtotal) : 0;
    if (subtotal >= 500) {
      methods[0].cost = 0;
      methods[0].freeShipping = true;
    }

    res.json({
      success: true,
      methods
    });
  } catch (error) {
    console.error('Get shipping methods error:', error);
    res.status(500).json({ error: 'Failed to get shipping methods' });
  }
};

// Abandon Checkout
exports.abandonCheckout = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const checkout = await Checkout.findOne({ sessionId });
    if (!checkout) {
      return res.status(404).json({ error: 'Checkout session not found' });
    }

    checkout.status = 'abandoned';
    await checkout.save();

    res.json({
      success: true,
      message: 'Checkout abandoned'
    });
  } catch (error) {
    console.error('Abandon checkout error:', error);
    res.status(500).json({ error: 'Failed to abandon checkout' });
  }
};
