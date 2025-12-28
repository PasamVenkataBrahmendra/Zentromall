const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const searchRoutes = require('./routes/searchRoutes');
const qaRoutes = require('./routes/qaRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const couponRoutes = require('./routes/couponRoutes'); // Import couponRoutes

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3002',
    'http://192.168.0.137:3002'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', require('./routes/reviewRoutes'));
app.use('/api/users', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/search', require('./routes/imageSearchRoutes'));
app.use('/api/qa', qaRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/coupons', couponRoutes); // Mounted coupon routes
app.use('/api/ai-shop', require('./routes/aiShopRoutes'));
app.use('/api/flash-sales', require('./routes/flashSaleRoutes'));
app.use('/api/size-guide', require('./routes/sizeGuideRoutes'));
app.use('/api/guest', require('./routes/guestRoutes'));
app.use('/api/daily-deals', require('./routes/dailyDealRoutes'));
app.use('/api/bundles', require('./routes/bundleRoutes'));
app.use('/api/buy-x-get-y', require('./routes/buyXGetYRoutes'));
app.use('/api/gift-cards', require('./routes/giftCardRoutes'));
app.use('/api/price-alerts', require('./routes/priceAlertRoutes'));
app.use('/api/stock-alerts', require('./routes/stockAlertRoutes'));
app.use('/api/waitlist', require('./routes/waitlistRoutes'));
app.use('/api/pre-orders', require('./routes/preOrderRoutes'));
app.use('/api/referrals', require('./routes/referralRoutes'));
app.use('/api/follow', require('./routes/followRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));
app.use('/api/seller', require('./routes/sellerRoutes'));
app.use('/api/video-reviews', require('./routes/videoReviewRoutes'));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'ZentroMall Backend is running' });
});

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'ZentroMall Backend API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});