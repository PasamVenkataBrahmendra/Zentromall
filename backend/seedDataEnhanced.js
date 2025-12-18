/**
 * Enhanced Seed Script - Integrates Original + Kaggle Datasets
 * Run: npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');
const Review = require('./models/Review');
const connectDB = require('./config/db');

// Import Kaggle data
const kaggleData = require('./kaggleDataIntegration');

const seedDatabase = async () => {
    try {
        await connectDB();
        
        console.log('🌱 Starting Enhanced Seeding with Kaggle Datasets...\n');
        
        // Clear existing data (optional - comment out to preserve)
        // await Product.deleteMany({});
        // await Review.deleteMany({});
        // await Category.deleteMany({});
        // console.log('✓ Cleared existing data\n');
        
        // 1. Create Categories
        console.log('📦 Creating Categories...');
        const categories = [
            { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800' },
            { name: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800' },
            { name: 'Home & Kitchen', slug: 'home-kitchen', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800' },
            { name: 'Books', slug: 'books', image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800' },
            { name: 'Sports & Fitness', slug: 'sports-fitness', image: 'https://images.unsplash.com/photo-1420310414923-bf3651a89816?w=800' },
            { name: 'Beauty & Personal Care', slug: 'beauty-personal-care', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800' }
        ];
        
        const categoryMap = {};
        for (const cat of categories) {
            const exists = await Category.findOne({ slug: cat.slug });
            if (!exists) {
                const created = await Category.create(cat);
                categoryMap[cat.slug] = created._id;
            } else {
                categoryMap[cat.slug] = exists._id;
            }
        }
        console.log(`✓ Categories ready (${Object.keys(categoryMap).length} categories)\n`);
        
        // 2. Create a test seller user
        console.log('👤 Creating Seller User...');
        let seller = await User.findOne({ email: 'seller@zentromall.com', role: 'seller' });
        if (!seller) {
            seller = await User.create({
                name: 'Zentromall Seller',
                email: 'seller@zentromall.com',
                password: 'hashedpassword', // Should be hashed in production
                role: 'seller',
                phone: '1234567890',
                addresses: [{
                    street: 'Seller Street',
                    city: 'Seller City',
                    state: 'Seller State',
                    zip: '123456',
                    country: 'Country'
                }]
            });
        }
        console.log(`✓ Seller user ready\n`);
        
        // 3. Process and insert Kaggle products
        console.log('🔄 Processing Kaggle Datasets...');
        console.log(`   - Olist Products: ${kaggleData.olistProducts.length}`);
        console.log(`   - Amazon Products: ${kaggleData.amazonProducts.length}`);
        console.log(`   - Fashion Products: ${kaggleData.fashionProducts.length}`);
        console.log(`   - Book Products: ${kaggleData.bookProducts.length}`);
        console.log(`   - Total Kaggle Products: ${kaggleData.allKaggleProducts.length}\n`);
        
        // Map category names to IDs and insert products
        const productPromises = kaggleData.allKaggleProducts.map(prod => {
            const categoryId = categoryMap[prod.category];
            if (!categoryId) {
                console.warn(`⚠️  Category not found for product: ${prod.title}`);
                return null;
            }
            
            return Product.findOneAndUpdate(
                { slug: prod.slug },
                {
                    ...prod,
                    category: categoryId,
                    seller: seller._id,
                    _id: undefined // Remove _id to let MongoDB create new one
                },
                { upsert: true, new: true }
            );
        });
        
        const insertedProducts = await Promise.all(productPromises);
        const successfulProducts = insertedProducts.filter(p => p !== null);
        console.log(`✓ Kaggle Products inserted: ${successfulProducts.length}\n`);
        
        // 4. Create reviews for Kaggle products
        console.log('⭐ Creating Product Reviews...');
        let reviewCount = 0;
        
        for (const product of successfulProducts) {
            // Get random number of reviews (3-6 per product)
            const reviewCount_per_product = Math.floor(Math.random() * 4) + 3;
            const randomReviews = kaggleData.getRandomReviews(reviewCount_per_product);
            
            for (const review of randomReviews) {
                const reviewExists = await Review.findOne({
                    product: product._id,
                    rating: review.rating,
                    comment: review.comment
                });
                
                if (!reviewExists) {
                    await Review.create({
                        product: product._id,
                        user: seller._id,
                        rating: review.rating,
                        comment: review.comment
                    });
                    reviewCount++;
                }
            }
        }
        console.log(`✓ Reviews created: ${reviewCount}\n`);
        
        // 5. Dataset Summary
        console.log('═════════════════════════════════════════');
        console.log('📊 SEEDING COMPLETE - DATASET SUMMARY');
        console.log('═════════════════════════════════════════\n');
        
        const totalProducts = await Product.countDocuments();
        const totalReviews = await Review.countDocuments();
        const totalCategories = await Category.countDocuments();
        
        console.log(`✓ Total Products: ${totalProducts}`);
        console.log(`✓ Total Reviews: ${totalReviews}`);
        console.log(`✓ Total Categories: ${totalCategories}`);
        console.log(`✓ Seller Account: seller@zentromall.com\n`);
        
        console.log('📚 Kaggle Datasets Integrated:');
        Object.entries(kaggleData.datasetSources).forEach(([key, source]) => {
            console.log(`   • ${source.name}`);
            console.log(`     URL: ${source.url}`);
            console.log(`     Products: ${source.products}\n`);
        });
        
        console.log('═════════════════════════════════════════\n');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding Error:', error.message);
        process.exit(1);
    }
};

// Run seeding
seedDatabase();
