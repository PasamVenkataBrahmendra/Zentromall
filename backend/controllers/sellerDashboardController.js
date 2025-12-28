const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get seller dashboard stats
// @route   GET /api/seller/dashboard
// @access  Private (Seller)
const getDashboardStats = async (req, res) => {
    try {
        const sellerId = req.user._id;
        const { period = '30' } = req.query; // days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));

        // Get orders for seller's products
        const orders = await Order.find({
            'items.product': { $in: await Product.find({ seller: sellerId }).distinct('_id') },
            createdAt: { $gte: startDate }
        }).populate('items.product');

        const sellerProducts = await Product.find({ seller: sellerId });

        // Calculate stats
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;
        const totalProducts = sellerProducts.length;
        const lowStockProducts = sellerProducts.filter(p => p.stock < 10).length;

        // Sales by day
        const salesByDay = {};
        orders.forEach(order => {
            const day = new Date(order.createdAt).toISOString().split('T')[0];
            salesByDay[day] = (salesByDay[day] || 0) + order.total;
        });

        // Top products
        const productSales = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                const productId = item.product._id.toString();
                if (sellerProducts.some(p => p._id.toString() === productId)) {
                    productSales[productId] = (productSales[productId] || 0) + (item.quantity * item.price);
                }
            });
        });

        const topProducts = Object.entries(productSales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([productId, revenue]) => {
                const product = sellerProducts.find(p => p._id.toString() === productId);
                return { product, revenue };
            });

        res.json({
            stats: {
                totalRevenue,
                totalOrders,
                totalProducts,
                lowStockProducts,
                averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
            },
            salesByDay,
            topProducts,
            recentOrders: orders.slice(0, 10)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };

