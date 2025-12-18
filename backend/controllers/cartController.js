const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const orderCalculator = require('../utils/orderCalculator');

// @desc    Get user cart with calculated totals
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'title price mrp discount images slug');
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        // Calculate pricing
        const cartItems = cart.items.map(item => ({
            ...item.toObject(),
            product: item.product
        }));

        const pricing = orderCalculator.calculateTotal(cartItems, {
            discount: null,
            taxRate: 0.18
        });

        res.json({
            ...cart.toObject(),
            pricing
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity, price: product.price });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (cart) {
            cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
            await cart.save();

            // Re-populate to return full product details
            await cart.populate('items.product', 'title price images slug');
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Apply coupon code to cart
// @route   POST /api/cart/coupon/:couponCode
// @access  Private
const applyCoupon = async (req, res) => {
    const { couponCode } = req.params;

    try {
        // Find coupon
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

        // Validate coupon
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const subtotal = orderCalculator.calculateSubtotal(cart.items);
        const validation = orderCalculator.validateCoupon(coupon, subtotal);

        if (!validation.valid) {
            return res.status(400).json({ message: validation.message });
        }

        // Store coupon in cart or separate tracking
        // For now, return the discount info
        res.json({
            valid: true,
            message: validation.message,
            discount: validation.discount,
            couponCode: couponCode.toUpperCase()
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Calculate cart totals with pricing breakdown
// @route   POST /api/cart/calculate
// @access  Private
const calculateTotal = async (req, res) => {
    const { couponCode, zipCode } = req.body;

    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        let discount = null;
        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
            const subtotal = orderCalculator.calculateSubtotal(cart.items);
            const validation = orderCalculator.validateCoupon(coupon, subtotal);
            
            if (validation.valid) {
                discount = validation.discount;
            }
        }

        const cartItems = cart.items.map(item => ({
            ...item.toObject(),
            product: item.product
        }));

        const pricing = orderCalculator.calculateTotal(cartItems, {
            discount,
            taxRate: 0.18,
            zipCode,
            couponCode
        });

        // Get shipping methods
        const shippingMethods = orderCalculator.getShippingMethods(pricing.subtotal, zipCode);

        res.json({
            pricing,
            shippingMethods
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get shipping methods
// @route   GET /api/cart/shipping
// @access  Private
const getShippingMethods = async (req, res) => {
    const { subtotal, zipCode } = req.query;

    try {
        const methods = orderCalculator.getShippingMethods(parseFloat(subtotal), zipCode);
        res.json(methods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    getCart, 
    addToCart, 
    removeFromCart,
    applyCoupon,
    calculateTotal,
    getShippingMethods
};
