const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'No items in cart' });
        }

        const order = new Order({
            user: req.user._id,
            items: cart.items,
            totalAmount: cart.totalPrice,
            shippingAddress,
            paymentStatus: 'pending'
        });

        const createdOrder = await order.save();

        // Clear cart
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.orderStatus = req.body.status || order.orderStatus;
            if (req.body.status === 'delivered') {
                order.paymentStatus = 'paid'; // Assume paid on delivery or already paid
            }
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get orders containing seller's products
// @route   GET /api/orders/sellerorders
// @access  Private/Seller
const getSellerOrders = async (req, res) => {
    try {
        // Find all products by this seller
        const Product = require('../models/Product'); // Import here to avoid circular dependency issues if any, or just use global
        const products = await Product.find({ seller: req.user._id });
        const productIds = products.map(p => p._id);

        // Find orders containing these products
        const orders = await Order.find({ 'items.product': { $in: productIds } })
            .populate('user', 'name')
            .populate('items.product');

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus, getSellerOrders };
