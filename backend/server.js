require('dotenv').config();
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
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/qa', qaRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/coupons', couponRoutes); // Mounted coupon routes
app.use('/api/ai-shop', require('./routes/aiShopRoutes'));
app.use('/api/flash-sales', require('./routes/flashSaleRoutes'));
app.use('/api', require('./routes/reviewRoutes'));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'ZentroMall Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});