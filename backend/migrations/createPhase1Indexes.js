/**
 * Migration: Create Phase 1 Database Indexes
 * 
 * This script creates all necessary database indexes for Phase 1 features:
 * - Search functionality (Product text indexes)
 * - Q&A functionality (QuestionAnswer indexes)
 * - Order tracking (Order indexes)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

// Models
const Product = require('../models/Product');
const QuestionAnswer = require('../models/QuestionAnswer');
const Order = require('../models/Order');

async function createIndexes() {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();
    console.log('✅ Connected to database');

    console.log('\n📋 Creating indexes...\n');

    // 1. Product Indexes (for search functionality)
    console.log('  Creating Product indexes for search...');
    await Product.collection.createIndex({ name: 'text', description: 'text', category: 1 });
    await Product.collection.createIndex({ category: 1 });
    await Product.collection.createIndex({ price: 1 });
    await Product.collection.createIndex({ rating: -1 });
    await Product.collection.createIndex({ createdAt: -1 });
    console.log('  ✅ Product indexes created');

    // 2. QuestionAnswer Indexes
    console.log('  Creating QuestionAnswer indexes...');
    await QuestionAnswer.collection.createIndex({ product: 1, status: 1 });
    await QuestionAnswer.collection.createIndex({ helpful: -1 });
    await QuestionAnswer.collection.createIndex({ 'question.askedAt': -1 });
    console.log('  ✅ QuestionAnswer indexes created');

    // 3. Order Indexes (for order tracking)
    console.log('  Creating Order indexes...');
    await Order.collection.createIndex({ orderNumber: 1 }, { unique: true });
    await Order.collection.createIndex({ user: 1 });
    await Order.collection.createIndex({ createdAt: -1 });
    await Order.collection.createIndex({ orderStatus: 1 });
    console.log('  ✅ Order indexes created');

    console.log('\n✅ All indexes created successfully!');
    console.log('\n📊 Indexes Summary:');
    console.log('  - Product: 5 indexes (search, category, price, rating, date)');
    console.log('  - QuestionAnswer: 3 indexes (product+status, helpful, date)');
    console.log('  - Order: 4 indexes (orderNumber, user, date, status)');
    console.log('\n💡 Indexes are now active and will improve query performance.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating indexes:', error.message);
    process.exit(1);
  }
}

// Run the migration
createIndexes();
