/**
 * Checkout Model
 * 
 * Manages the checkout session with multi-step flow:
 * Step 1: Shipping Address Selection
 * Step 2: Shipping Method Selection
 * Step 3: Payment Method Selection
 * Step 4: Order Review
 * Step 5: Order Confirmation
 */

const mongoose = require('mongoose');

const checkoutSchema = new mongoose.Schema(
  {
    // Session Info
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    sessionId: {
      type: String,
      unique: true,
      required: true
    },

    // Step 1: Shipping Address
    shippingAddress: {
      fullName: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: 'India'
      },
      isDefault: {
        type: Boolean,
        default: false
      },
      addressType: {
        type: String,
        enum: ['home', 'office', 'other'],
        default: 'home'
      }
    },

    // Step 2: Shipping Method
    shippingMethod: {
      method: {
        type: String,
        enum: ['standard', 'express', 'overnight']
      },
      cost: {
        type: Number
      },
      estimatedDays: {
        type: Number
      },
      carrier: String // e.g., Fedex, UPS, DHL
    },

    // Step 3: Payment Method
    paymentMethod: {
      gateway: {
        type: String,
        enum: ['razorpay', 'stripe', 'native', 'cod']
      },
      type: {
        type: String,
        enum: ['credit_card', 'debit_card', 'upi', 'razorpay', 'stripe', 'wallet', 'cod']
      },
      details: {
        // For Razorpay
        razorpayOrderId: String,
        razorpayPaymentId: String,
        razorpaySignature: String,

        // For Stripe
        stripePaymentIntentId: String,
        stripeClientSecret: String,

        // For Card
        cardLast4: String,
        cardBrand: String, // Visa, Mastercard, etc.

        // For UPI
        upiId: String,

        // For Wallet
        walletProvider: String
      }
    },

    // Step 4 & 5: Order Summary
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        price: {
          type: Number,
          required: true
        },
        discount: {
          type: Number,
          default: 0
        },
        subtotal: {
          type: Number,
          required: true
        }
      }
    ],

    // Pricing Breakdown
    pricing: {
      subtotal: {
        type: Number,
        required: true
      },
      discount: {
        type: Number,
        default: 0
      },
      tax: {
        type: Number,
        required: true
      },
      shipping: {
        type: Number,
        required: true
      },
      total: {
        type: Number,
        required: true
      }
    },

    // Coupon/Promo
    coupon: {
      code: String,
      discountAmount: {
        type: Number,
        default: 0
      },
      discountPercentage: Number,
      maxDiscount: Number
    },

    // Checkout Progress
    currentStep: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: 1
    },

    completedSteps: {
      type: [Number],
      default: []
    },

    // Status
    status: {
      type: String,
      enum: [
        'initiated',      // Session started
        'address_set',    // Step 1 complete
        'shipping_set',   // Step 2 complete
        'payment_pending', // Step 3 complete, payment pending
        'payment_processing', // Payment in progress
        'payment_success', // Payment successful
        'order_created',  // Order created from checkout
        'expired',        // Session expired (24 hours)
        'abandoned'       // User abandoned checkout
      ],
      default: 'initiated',
      index: true
    },

    // Payment Status
    paymentStatus: {
      type: String,
      enum: ['pending', 'processing', 'success', 'failed', 'cancelled', 'refunded'],
      default: 'pending'
    },

    // Errors & Retry Info
    sessionErrors: [
      {
        step: Number,
        message: String,
        code: String,
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ],

    retryCount: {
      type: Number,
      default: 0
    },

    lastRetryAt: Date,

    // Order Reference (after successful checkout)
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },

    // Timestamps
    initiatedAt: {
      type: Date,
      default: Date.now
    },

    lastUpdatedAt: {
      type: Date,
      default: Date.now
    },

    completedAt: Date,

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    },

    // Additional Info
    notes: String,
    ipAddress: String,
    userAgent: String
  },
  {
    timestamps: true,
    collection: 'checkouts'
  }
);

// Indexes for performance
checkoutSchema.index({ user: 1, createdAt: -1 });
checkoutSchema.index({ status: 1 });
checkoutSchema.index({ sessionId: 1 }, { unique: true });
checkoutSchema.index({ expiresAt: 1 });
checkoutSchema.index({ orderId: 1 });
checkoutSchema.index({ 'paymentMethod.gateway': 1 });

// TTL Index - Automatically delete expired sessions after 24 hours
checkoutSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Pre-save middleware
checkoutSchema.pre('save', function (next) {
  this.lastUpdatedAt = new Date();
  next();
});

// Method to get total amount
checkoutSchema.methods.getTotalAmount = function () {
  return this.pricing.total;
};

// Method to add error
checkoutSchema.methods.addError = function (step, message, code) {
  this.sessionErrors.push({
    step,
    message,
    code,
    timestamp: new Date()
  });
  return this;
};

// Method to mark step complete
checkoutSchema.methods.markStepComplete = function (step) {
  if (!this.completedSteps.includes(step)) {
    this.completedSteps.push(step);
  }
  return this;
};

// Method to validate checkout data
checkoutSchema.methods.validateCheckoutData = function () {
  const errors = [];

  // Step 1: Address validation
  if (this.currentStep >= 1) {
    const addr = this.shippingAddress;
    if (!addr.fullName) errors.push('Full name required');
    if (!addr.phone || addr.phone.length < 10) errors.push('Valid phone required');
    if (!addr.addressLine1) errors.push('Address line 1 required');
    if (!addr.city) errors.push('City required');
    if (!addr.state) errors.push('State required');
    if (!addr.zipCode || !addr.zipCode.toString().match || !/^\d{6}$/.test(addr.zipCode.toString())) errors.push('Valid 6-digit zip code required');
  }

  // Step 2: Shipping validation
  if (this.currentStep >= 2) {
    if (!this.shippingMethod.method) errors.push('Shipping method required');
    if (this.shippingMethod.cost < 0) errors.push('Invalid shipping cost');
  }

  // Step 3: Payment validation
  if (this.currentStep >= 3) {
    if (!this.paymentMethod.type) errors.push('Payment method required');
    if (!this.paymentMethod.gateway) errors.push('Payment gateway required');
  }

  return { valid: errors.length === 0, errors };
};

module.exports = mongoose.model('Checkout', checkoutSchema);
