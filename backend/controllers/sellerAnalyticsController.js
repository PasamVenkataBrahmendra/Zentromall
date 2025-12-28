const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get seller analytics
// @route   GET /api/seller/analytics
// @access  Private (Seller)
const getAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const sellerId = req.user._id;

        const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const end = endDate ? new Date(endDate) : new Date();

        const sellerProducts = await Product.find({ seller: sellerId }).select('_id');
        const productIds = sellerProducts.map(p => p._id);

        const orders = await Order.find({
            'items.product': { $in: productIds },
            createdAt: { $gte: start, $lte: end }
        }).populate('items.product');

        // Revenue analytics
        const totalRevenue = orders.reduce((sum, order) => {
            const sellerItems = order.items.filter(item =>
                productIds.some(id => id.toString() === item.product._id.toString())
            );
            return sum + sellerItems.reduce((s, item) => s + (item.price * item.quantity), 0);
        }, 0);

        // Sales by product
        const productSales = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                const productId = item.product._id.toString();
                if (productIds.some(id => id.toString() === productId)) {
                    if (!productSales[productId]) {
                        productSales[productId] = { revenue: 0, quantity: 0, product: item.product };
                    }
                    productSales[productId].revenue += item.price * item.quantity;
                    productSales[productId].quantity += item.quantity;
                }
            });
        });

        // Sales by day
        const salesByDay = {};
        orders.forEach(order => {
            const day = new Date(order.createdAt).toISOString().split('T')[0];
            if (!salesByDay[day]) salesByDay[day] = 0;
            const sellerItems = order.items.filter(item =>
                productIds.some(id => id.toString() === item.product._id.toString())
            );
            salesByDay[day] += sellerItems.reduce((s, item) => s + (item.price * item.quantity), 0);
        });

        // Top products
        const topProducts = Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);

        res.json({
            period: { start, end },
            revenue: {
                total: totalRevenue,
                average: orders.length > 0 ? totalRevenue / orders.length : 0,
                growth: 0 // Calculate from previous period
            },
            orders: {
                total: orders.length,
                completed: orders.filter(o => o.orderStatus === 'delivered').length,
                pending: orders.filter(o => ['pending', 'confirmed', 'processing'].includes(o.orderStatus)).length
            },
            products: {
                total: sellerProducts.length,
                topSelling: topProducts
            },
            salesByDay
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAnalytics };

