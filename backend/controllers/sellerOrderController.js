const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get seller's orders
// @route   GET /api/seller/orders
// @access  Private (Seller)
const getSellerOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        // Get seller's product IDs
        const sellerProducts = await Product.find({ seller: req.user._id }).select('_id');
        const productIds = sellerProducts.map(p => p._id);

        // Find orders containing seller's products
        let query = {
            'items.product': { $in: productIds }
        };

        if (status) {
            query.orderStatus = status;
        }

        const orders = await Order.find(query)
            .populate('user', 'name email')
            .populate('items.product', 'title images seller')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Filter to only include seller's items
        const filteredOrders = orders.map(order => {
            const sellerItems = order.items.filter(item =>
                productIds.some(id => id.toString() === item.product._id.toString())
            );
            return {
                ...order.toObject(),
                items: sellerItems,
                total: sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };
        });

        const total = await Order.countDocuments(query);

        res.json({
            orders: filteredOrders,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status (seller)
// @route   PUT /api/seller/orders/:orderId/status
// @access  Private (Seller)
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, trackingNumber } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify seller owns products in order
        const sellerProducts = await Product.find({ seller: req.user._id }).select('_id');
        const productIds = sellerProducts.map(p => p._id.toString());
        const hasSellerProducts = order.items.some(item =>
            productIds.includes(item.product.toString())
        );

        if (!hasSellerProducts) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        order.orderStatus = status;
        if (trackingNumber) {
            order.trackingNumber = trackingNumber;
        }

        await order.save();

        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getSellerOrders, updateOrderStatus };

