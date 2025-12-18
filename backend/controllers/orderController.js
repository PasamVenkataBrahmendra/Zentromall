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

        // Validate and Decrement Stock
        const Product = require('../models/Product');
        const bulkOps = [];

        for (const item of cart.items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }

            // Check stock
            // Note: Simple implementation on main stock.
            // Future compatibility: If variant selected, check variant stock.
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.title}` });
            }

            // Prepare bulk update to decrement stock
            // We do this one by one for now to ensure safety, or use bulkWrite for atomic operations
            product.stock -= item.quantity;
            await product.save();
        }

        const createdOrder = await order.save();

        // Send Order Confirmation Email
        try {
            const { orderConfirmationTemplate } = require('../utils/emailTemplates');
            const sendEmail = require('../utils/emailService');

            // Populate user name/email for the template if needed, though req.user has it
            const fullOrder = await Order.findById(createdOrder._id).populate('user', 'name email').populate('items.product');

            await sendEmail({
                email: req.user.email,
                subject: `Order Confirmed #${createdOrder._id.toString().slice(-6).toUpperCase()}`,
                html: orderConfirmationTemplate(fullOrder)
            });
        } catch (emailError) {
            console.error('Order email failed:', emailError);
        }

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

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email').populate('items.product');

        if (order) {
            // Check if user owns order or is admin
            if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
                return res.status(401).json({ message: 'Not authorized to view this order' });
            }
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus, getSellerOrders, getOrderById };

