/**
 * Order Calculator Utility
 * Handles all order calculations: subtotal, tax, shipping, discounts, total
 */

class OrderCalculator {
  /**
   * Calculate subtotal from items
   * @param {Array} items - Cart items with price and quantity
   * @returns {Number} Subtotal amount
   */
  calculateSubtotal(items) {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
  }

  /**
   * Calculate GST/Tax
   * @param {Number} subtotal - Subtotal amount
   * @param {Number} taxRate - Tax rate (default 18% for India GST)
   * @returns {Number} Tax amount
   */
  calculateTax(subtotal, taxRate = 0.18) {
    return Math.round((subtotal * taxRate) * 100) / 100;
  }

  /**
   * Calculate shipping cost based on items/location
   * @param {Array} items - Cart items
   * @param {String} zipCode - Delivery zip code
   * @returns {Number} Shipping cost
   */
  calculateShipping(items, zipCode = null) {
    // Free shipping on orders above 500
    const subtotal = this.calculateSubtotal(items);
    if (subtotal > 500) return 0;

    // Base shipping cost
    const baseShipping = 40;

    // Additional cost for heavy items
    const heavyItemCost = items.reduce((cost, item) => {
      // Assume items over 500 are heavy
      return cost + (item.price > 500 ? 20 : 0);
    }, 0);

    return baseShipping + heavyItemCost;
  }

  /**
   * Apply discount/coupon
   * @param {Number} subtotal - Subtotal amount
   * @param {Object} discount - Discount object {type: 'percentage'|'fixed', value: number}
   * @returns {Number} Discounted amount
   */
  applyDiscount(subtotal, discount) {
    if (!discount || !discount.value) return 0;

    if (discount.type === 'percentage') {
      return Math.round((subtotal * discount.value / 100) * 100) / 100;
    } else if (discount.type === 'fixed') {
      return Math.min(discount.value, subtotal); // Can't exceed subtotal
    }
    return 0;
  }

  /**
   * Calculate final total
   * @param {Array} items - Cart items
   * @param {Object} options - {discount, taxRate, zipCode}
   * @returns {Object} Complete breakdown
   */
  calculateTotal(items, options = {}) {
    const {
      discount = null,
      taxRate = 0.18,
      zipCode = null,
      couponCode = null
    } = options;

    const subtotal = this.calculateSubtotal(items);
    const discountAmount = this.applyDiscount(subtotal, discount);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const tax = this.calculateTax(subtotalAfterDiscount, taxRate);
    const shipping = this.calculateShipping(items, zipCode);
    const total = subtotalAfterDiscount + tax + shipping;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round(discountAmount * 100) / 100,
      subtotalAfterDiscount: Math.round(subtotalAfterDiscount * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      taxRate: (taxRate * 100).toFixed(1) + '%',
      shipping: Math.round(shipping * 100) / 100,
      shippingFree: shipping === 0,
      total: Math.round(total * 100) / 100,
      couponCode: couponCode || null,
      itemCount: items.length
    };
  }

  /**
   * Validate coupon
   * @param {Object} coupon - Coupon object from database
   * @param {Number} subtotal - Order subtotal
   * @returns {Object} {valid: boolean, message: string, discount: object}
   */
  validateCoupon(coupon, subtotal) {
    if (!coupon) {
      return { valid: false, message: 'Coupon not found' };
    }

    if (!coupon.isActive) {
      return { valid: false, message: 'Coupon is inactive' };
    }

    if (new Date() > coupon.expiryDate) {
      return { valid: false, message: 'Coupon has expired' };
    }

    if (coupon.minPurchase && subtotal < coupon.minPurchase) {
      return {
        valid: false,
        message: `Minimum purchase of ₹${coupon.minPurchase} required`
      };
    }

    return {
      valid: true,
      message: 'Coupon applied successfully',
      discount: {
        type: coupon.discountType,
        value: coupon.discountValue
      }
    };
  }

  /**
   * Get applicable shipping methods
   * @param {Number} subtotal - Order subtotal
   * @param {String} zipCode - Delivery zip code
   * @returns {Array} Available shipping methods
   */
  getShippingMethods(subtotal, zipCode) {
    const methods = [
      {
        id: 'standard',
        name: 'Standard Shipping',
        duration: '5-7 business days',
        cost: subtotal > 500 ? 0 : 40,
        estimatedDate: this.addBusinessDays(new Date(), 5)
      },
      {
        id: 'express',
        name: 'Express Shipping',
        duration: '2-3 business days',
        cost: 99,
        estimatedDate: this.addBusinessDays(new Date(), 2)
      },
      {
        id: 'overnight',
        name: 'Overnight Delivery',
        duration: 'Next day',
        cost: 199,
        estimatedDate: this.addBusinessDays(new Date(), 1)
      }
    ];

    return methods;
  }

  /**
   * Add business days to a date
   * @param {Date} date - Start date
   * @param {Number} days - Number of business days to add
   * @returns {Date} Resulting date
   */
  addBusinessDays(date, days) {
    let current = new Date(date);
    let added = 0;

    while (added < days) {
      current.setDate(current.getDate() + 1);
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (current.getDay() % 6 !== 0) {
        added++;
      }
    }

    return current;
  }

  /**
   * Format currency for display
   * @param {Number} amount - Amount to format
   * @returns {String} Formatted currency string
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }
}

module.exports = new OrderCalculator();
