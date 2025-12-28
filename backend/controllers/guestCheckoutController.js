const GuestCart = require('../models/GuestCart');
const GuestOrder = require('../models/GuestOrder');
const Product = require('../models/Product');
const crypto = require('crypto');
const orderCalculator = require('../utils/orderCalculator');

// Generate session ID
const generateSessionId = () => crypto.randomBytes(16).toString('hex');

// @desc    Get or create guest cart
// @route   GET /api/guest/cart
// @access  Public
const getGuestCart = async (req, res) => {
    try {
        let sessionId = req.headers['x-session-id'] || req.query.sessionId;

        if (!sessionId) {
            sessionId = generateSessionId();
            const cart = new GuestCart({ sessionId });
            await cart.save();
            return res.json({ cart, sessionId });
        }

        const cart = await GuestCart.findOne({ sessionId }).populate('items.product');
        if (!cart) {
            const newCart = new GuestCart({ sessionId });
            await newCart.save();
            return res.json({ cart: newCart, sessionId });
        }

        res.json({ cart, sessionId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add item to guest cart
// @route   POST /api/guest/cart
// @access  Public
const addToGuestCart = async (req, res) => {
    try {
        const { sessionId, productId, quantity = 1 } = req.body;

        if (!sessionId) {
            return res.status(400).json({ message: 'Session ID required' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await GuestCart.findOne({ sessionId });
        if (!cart) {
            cart = new GuestCart({ sessionId });
        }

        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                quantity,
                price: product.price
            });
        }

        await cart.save();
        await cart.populate('items.product');

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create guest order
// @route   POST /api/guest/checkout
// @access  Public
const createGuestOrder = async (req, res) => {
    try {
        const { sessionId, email, phone, shippingAddress, paymentMethod } = req.body;

        const cart = await GuestCart.findOne({ sessionId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate totals
        const items = cart.items.map(item => ({
            price: item.price,
            quantity: item.quantity
        }));

        const subtotal = orderCalculator.calculateSubtotal(items);
        const tax = orderCalculator.calculateTax(subtotal);
        const shipping = orderCalculator.calculateShipping(items);
        const total = subtotal + tax + shipping;

        // Generate order number
        const orderNumber = `GUEST-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        const order = new GuestOrder({
            orderNumber,
            email,
            phone,
            items: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.price
            })),
            shippingAddress,
            paymentMethod,
            subtotal,
            tax,
            shipping,
            total,
            orderStatus: 'pending'
        });

        await order.save();

        // Clear cart
        await GuestCart.findOneAndDelete({ sessionId });

        res.status(201).json({
            success: true,
            order: {
                orderNumber: order.orderNumber,
                total: order.total,
                status: order.orderStatus
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Track guest order
// @route   GET /api/guest/orders/:orderNumber
// @access  Public
const getGuestOrder = async (req, res) => {
    try {
        const { orderNumber } = req.params;
        const { email, phone } = req.query;

        const order = await GuestOrder.findOne({ orderNumber })
            .populate('items.product', 'title images slug');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify email or phone matches
        if (email && order.email !== email) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        if (phone && order.phone !== phone) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getGuestCart,
    addToGuestCart,
    createGuestOrder,
    getGuestOrder
};

