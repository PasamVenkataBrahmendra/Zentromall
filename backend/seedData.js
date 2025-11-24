require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');

const connectDB = require('./config/db');

// Sample categories
const categories = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Home & Kitchen', slug: 'home-kitchen' },
    { name: 'Books', slug: 'books' },
    { name: 'Sports & Fitness', slug: 'sports-fitness' },
    { name: 'Beauty & Personal Care', slug: 'beauty-personal-care' }
];

// Sample products
const products = [
    // Electronics
    { title: 'Wireless Bluetooth Headphones', price: 79.99, description: 'Premium noise-cancelling wireless headphones with 30-hour battery life', images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'], category: 'electronics', stock: 50, slug: 'wireless-bluetooth-headphones' },
    { title: 'Smart Watch Series 7', price: 399.99, description: 'Advanced fitness tracking, heart rate monitor, GPS, water resistant', images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'], category: 'electronics', stock: 30, slug: 'smart-watch-series-7' },
    { title: 'Laptop 15.6" Full HD', price: 899.99, description: 'Intel i7, 16GB RAM, 512GB SSD, Windows 11', images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'], category: 'electronics', stock: 20, slug: 'laptop-156-full-hd' },
    { title: 'Wireless Gaming Mouse', price: 59.99, description: 'RGB lighting, 16000 DPI, programmable buttons', images: ['https://images.unsplash.com/photo-1527814050087-3793815479db?w=500'], category: 'electronics', stock: 100, slug: 'wireless-gaming-mouse' },
    { title: '4K Ultra HD Smart TV 55"', price: 599.99, description: 'HDR, built-in streaming apps, voice control', images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500'], category: 'electronics', stock: 15, slug: '4k-ultra-hd-smart-tv-55' },

    // Fashion
    { title: 'Classic Denim Jacket', price: 89.99, description: 'Vintage wash, 100% cotton, unisex fit', images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'], category: 'fashion', stock: 75, slug: 'classic-denim-jacket' },
    { title: 'Running Sneakers Pro', price: 129.99, description: 'Lightweight, breathable mesh, cushioned sole', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'], category: 'fashion', stock: 60, slug: 'running-sneakers-pro' },
    { title: 'Leather Crossbody Bag', price: 149.99, description: 'Genuine leather, adjustable strap, multiple compartments', images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500'], category: 'fashion', stock: 40, slug: 'leather-crossbody-bag' },
    { title: 'Cotton T-Shirt Pack (3)', price: 39.99, description: 'Soft cotton blend, crew neck, assorted colors', images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'], category: 'fashion', stock: 200, slug: 'cotton-tshirt-pack-3' },
    { title: 'Aviator Sunglasses', price: 79.99, description: 'UV400 protection, polarized lenses, metal frame', images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500'], category: 'fashion', stock: 80, slug: 'aviator-sunglasses' },

    // Home & Kitchen
    { title: 'Stainless Steel Cookware Set', price: 199.99, description: '10-piece set, dishwasher safe, induction compatible', images: ['https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500'], category: 'home-kitchen', stock: 25, slug: 'stainless-steel-cookware-set' },
    { title: 'Coffee Maker with Grinder', price: 149.99, description: 'Built-in burr grinder, programmable, 12-cup capacity', images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500'], category: 'home-kitchen', stock: 35, slug: 'coffee-maker-with-grinder' },
    { title: 'Memory Foam Pillow Set (2)', price: 59.99, description: 'Hypoallergenic, cooling gel, washable cover', images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500'], category: 'home-kitchen', stock: 100, slug: 'memory-foam-pillow-set-2' },
    { title: 'Robot Vacuum Cleaner', price: 299.99, description: 'Smart navigation, app control, auto-charging', images: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500'], category: 'home-kitchen', stock: 20, slug: 'robot-vacuum-cleaner' },

    // Books
    { title: 'The Art of Programming', price: 49.99, description: 'Comprehensive guide to software development best practices', images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500'], category: 'books', stock: 150, slug: 'art-of-programming' },
    { title: 'Mindfulness & Meditation', price: 24.99, description: 'Practical techniques for stress reduction and mental clarity', images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'], category: 'books', stock: 200, slug: 'mindfulness-meditation' },
    { title: 'World History Encyclopedia', price: 89.99, description: 'Illustrated hardcover, 1000+ pages, comprehensive timeline', images: ['https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500'], category: 'books', stock: 50, slug: 'world-history-encyclopedia' },

    // Sports & Fitness
    { title: 'Yoga Mat Premium', price: 39.99, description: 'Non-slip, eco-friendly, 6mm thick, includes carrying strap', images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'], category: 'sports-fitness', stock: 120, slug: 'yoga-mat-premium' },
    { title: 'Adjustable Dumbbell Set', price: 249.99, description: '5-52.5 lbs per dumbbell, space-saving design', images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500'], category: 'sports-fitness', stock: 30, slug: 'adjustable-dumbbell-set' },
    { title: 'Resistance Bands Set', price: 29.99, description: '5 bands, different resistance levels, portable', images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500'], category: 'sports-fitness', stock: 150, slug: 'resistance-bands-set' },

    // Beauty & Personal Care
    { title: 'Skincare Gift Set', price: 79.99, description: 'Cleanser, toner, moisturizer, serum - all natural ingredients', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'], category: 'beauty-personal-care', stock: 60, slug: 'skincare-gift-set' },
    { title: 'Electric Hair Dryer Pro', price: 89.99, description: 'Ionic technology, multiple heat settings, cool shot button', images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500'], category: 'beauty-personal-care', stock: 45, slug: 'electric-hair-dryer-pro' },
    { title: 'Fragrance Collection Set', price: 129.99, description: '5 premium fragrances, 10ml each, travel-friendly', images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=500'], category: 'beauty-personal-care', stock: 70, slug: 'fragrance-collection-set' }
];

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Category.deleteMany({});
        await Product.deleteMany({});
        console.log('Cleared existing data');

        // Insert categories
        const createdCategories = await Category.insertMany(categories);
        console.log(`Inserted ${createdCategories.length} categories`);

        // Map category slugs to IDs
        const categoryMap = {};
        createdCategories.forEach(cat => {
            categoryMap[cat.slug] = cat._id;
        });

        // Update products with category IDs
        const productsWithCategories = products.map(product => ({
            ...product,
            category: categoryMap[product.category]
        }));

        // Insert products
        const createdProducts = await Product.insertMany(productsWithCategories);
        console.log(`Inserted ${createdProducts.length} products`);

        console.log('✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
