require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');

const connectDB = require('./config/db');

// Sample categories
const categories = [
    { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800' },
    { name: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800' },
    { name: 'Home & Kitchen', slug: 'home-kitchen', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800' },
    { name: 'Books', slug: 'books', image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800' },
    { name: 'Sports & Fitness', slug: 'sports-fitness', image: 'https://images.unsplash.com/photo-1420310414923-bf3651a89816?w=800' },
    { name: 'Beauty & Personal Care', slug: 'beauty-personal-care', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800' }
];

// Sample products - Comprehensive catalog like Amazon/Flipkart
const products = [
    // ============ ELECTRONICS (20 products) ============
    { title: 'Wireless Bluetooth Headphones', price: 79.99, mrp: 99.99, description: 'Premium noise-cancelling wireless headphones with 30-hour battery life, deep bass, and crystal clear sound', images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'], category: 'electronics', stock: 50, slug: 'wireless-bluetooth-headphones' },
    { title: 'Smart Watch Series 7', price: 399.99, mrp: 499.99, description: 'Advanced fitness tracking, heart rate monitor, GPS, water resistant, sleep tracking, 50+ workout modes', images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'], category: 'electronics', stock: 30, slug: 'smart-watch-series-7' },
    { title: 'Laptop 15.6" Full HD', price: 899.99, mrp: 1199.99, description: 'Intel i7 11th Gen, 16GB RAM, 512GB SSD, Windows 11, NVIDIA Graphics, Backlit Keyboard', images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'], category: 'electronics', stock: 20, slug: 'laptop-156-full-hd' },
    { title: 'Wireless Gaming Mouse', price: 59.99, mrp: 79.99, description: 'RGB lighting, 16000 DPI, programmable buttons, ergonomic design, 70-hour battery life', images: ['https://images.unsplash.com/photo-1527814050087-3793815479db?w=500'], category: 'electronics', stock: 100, slug: 'wireless-gaming-mouse' },
    { title: '4K Ultra HD Smart TV 55"', price: 599.99, mrp: 799.99, description: 'HDR10+, built-in Netflix/Prime/Disney+, voice control, 120Hz refresh rate, Dolby Atmos', images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500'], category: 'electronics', stock: 15, slug: '4k-ultra-hd-smart-tv-55' },
    { title: 'Wireless Earbuds Pro', price: 149.99, mrp: 199.99, description: 'Active noise cancellation, 24-hour battery with case, IPX7 waterproof, touch controls', images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500'], category: 'electronics', stock: 85, slug: 'wireless-earbuds-pro' },
    { title: 'Mechanical Gaming Keyboard', price: 129.99, mrp: 169.99, description: 'RGB backlit, blue switches, anti-ghosting, aluminum frame, wrist rest included', images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500'], category: 'electronics', stock: 60, slug: 'mechanical-gaming-keyboard' },
    { title: 'Portable Bluetooth Speaker', price: 89.99, mrp: 119.99, description: '360° sound, 20-hour battery, waterproof IPX7, deep bass, USB-C charging', images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500'], category: 'electronics', stock: 120, slug: 'portable-bluetooth-speaker' },
    { title: 'Tablet 10.5" 128GB', price: 449.99, mrp: 549.99, description: 'Octa-core processor, 2K display, 8GB RAM, Android 13, stylus included, dual cameras', images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500'], category: 'electronics', stock: 40, slug: 'tablet-105-128gb' },
    { title: 'USB-C Hub 7-in-1', price: 39.99, mrp: 59.99, description: 'HDMI 4K, 3x USB 3.0, SD/TF card reader, 100W PD charging, aluminum body', images: ['https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500'], category: 'electronics', stock: 200, slug: 'usb-c-hub-7in1' },
    { title: 'Webcam 1080p HD', price: 69.99, mrp: 89.99, description: 'Auto-focus, dual microphones, 90° wide angle, low-light correction, tripod ready', images: ['https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=500'], category: 'electronics', stock: 75, slug: 'webcam-1080p-hd' },
    { title: 'External SSD 1TB', price: 119.99, mrp: 159.99, description: 'USB 3.2 Gen 2, 1050MB/s read speed, shock resistant, compact design, 5-year warranty', images: ['https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500'], category: 'electronics', stock: 90, slug: 'external-ssd-1tb' },
    { title: 'Smartphone 5G 256GB', price: 699.99, mrp: 899.99, description: '6.7" AMOLED display, 108MP camera, 8GB RAM, 5000mAh battery, fast charging', images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'], category: 'electronics', stock: 35, slug: 'smartphone-5g-256gb' },
    { title: 'Wireless Charger Stand', price: 29.99, mrp: 39.99, description: '15W fast charging, Qi-certified, adjustable angle, LED indicator, case-friendly', images: ['https://images.unsplash.com/photo-1591290619762-c588f7e8e86f?w=500'], category: 'electronics', stock: 150, slug: 'wireless-charger-stand' },
    { title: 'Action Camera 4K', price: 249.99, mrp: 329.99, description: 'Waterproof 40m, image stabilization, 170° wide angle, WiFi, voice control, accessories included', images: ['https://images.unsplash.com/photo-1606041011872-596597976b25?w=500'], category: 'electronics', stock: 45, slug: 'action-camera-4k' },
    { title: 'Power Bank 20000mAh', price: 49.99, mrp: 69.99, description: 'Fast charging 18W, dual USB ports, LED display, portable, charges 4-5 times', images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500'], category: 'electronics', stock: 180, slug: 'power-bank-20000mah' },
    { title: 'Smart Home Security Camera', price: 79.99, mrp: 99.99, description: '1080p HD, night vision, motion detection, two-way audio, cloud storage, app control', images: ['https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=500'], category: 'electronics', stock: 65, slug: 'smart-home-security-camera' },
    { title: 'E-Reader 7" Paperwhite', price: 139.99, mrp: 179.99, description: '16GB storage, adjustable warm light, waterproof, 6-week battery, glare-free display', images: ['https://images.unsplash.com/photo-1592503254549-d83d24a4dfab?w=500'], category: 'electronics', stock: 70, slug: 'ereader-7-paperwhite' },
    { title: 'Gaming Headset RGB', price: 79.99, mrp: 99.99, description: '7.1 surround sound, noise-canceling mic, memory foam ear cups, RGB lighting, multi-platform', images: ['https://images.unsplash.com/photo-1599669454699-248893623440?w=500'], category: 'electronics', stock: 95, slug: 'gaming-headset-rgb' },
    { title: 'Monitor 27" QHD 144Hz', price: 349.99, mrp: 449.99, description: '2560x1440, IPS panel, 1ms response, FreeSync, HDR10, VESA mount compatible', images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500'], category: 'electronics', stock: 25, slug: 'monitor-27-qhd-144hz' },

    // ============ FASHION (20 products) ============
    { title: 'Classic Denim Jacket', price: 89.99, mrp: 119.99, description: 'Vintage wash, 100% cotton, unisex fit, button closure, chest pockets, timeless style', images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'], category: 'fashion', stock: 75, slug: 'classic-denim-jacket' },
    { title: 'Running Sneakers Pro', price: 129.99, mrp: 159.99, description: 'Lightweight, breathable mesh, cushioned sole, arch support, reflective details, multiple colors', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'], category: 'fashion', stock: 60, slug: 'running-sneakers-pro' },
    { title: 'Leather Crossbody Bag', price: 149.99, mrp: 199.99, description: 'Genuine leather, adjustable strap, multiple compartments, RFID protection, elegant design', images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500'], category: 'fashion', stock: 40, slug: 'leather-crossbody-bag' },
    { title: 'Cotton T-Shirt Pack (3)', price: 39.99, mrp: 49.99, description: 'Soft cotton blend, crew neck, assorted colors, pre-shrunk, tagless, everyday comfort', images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'], category: 'fashion', stock: 200, slug: 'cotton-tshirt-pack-3' },
    { title: 'Aviator Sunglasses', price: 79.99, mrp: 99.99, description: 'UV400 protection, polarized lenses, metal frame, spring hinges, includes case and cloth', images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500'], category: 'fashion', stock: 80, slug: 'aviator-sunglasses' },
    { title: 'Slim Fit Chinos', price: 69.99, mrp: 89.99, description: 'Stretch fabric, multiple colors, flat front, belt loops, machine washable, versatile style', images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500'], category: 'fashion', stock: 110, slug: 'slim-fit-chinos' },
    { title: 'Leather Belt Classic', price: 34.99, mrp: 44.99, description: 'Full-grain leather, reversible black/brown, metal buckle, adjustable, gift boxed', images: ['https://images.unsplash.com/photo-1624222247344-550fb60583c2?w=500'], category: 'fashion', stock: 140, slug: 'leather-belt-classic' },
    { title: 'Winter Wool Coat', price: 199.99, mrp: 259.99, description: 'Premium wool blend, double-breasted, inner pockets, warm lining, dry clean only', images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500'], category: 'fashion', stock: 35, slug: 'winter-wool-coat' },
    { title: 'Sports Joggers', price: 49.99, mrp: 64.99, description: 'Moisture-wicking, elastic waistband, zippered pockets, tapered fit, breathable fabric', images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500'], category: 'fashion', stock: 125, slug: 'sports-joggers' },
    { title: 'Formal Dress Shirt', price: 59.99, mrp: 79.99, description: 'Cotton blend, wrinkle-resistant, button-down collar, long sleeves, professional fit', images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500'], category: 'fashion', stock: 90, slug: 'formal-dress-shirt' },
    { title: 'Casual Backpack 30L', price: 79.99, mrp: 99.99, description: 'Water-resistant, laptop compartment, USB charging port, padded straps, multiple pockets', images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'], category: 'fashion', stock: 85, slug: 'casual-backpack-30l' },
    { title: 'Knit Sweater Pullover', price: 89.99, mrp: 119.99, description: 'Soft merino wool, crew neck, ribbed cuffs, available in 6 colors, cozy and warm', images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500'], category: 'fashion', stock: 70, slug: 'knit-sweater-pullover' },
    { title: 'Ankle Boots Leather', price: 139.99, mrp: 179.99, description: 'Genuine leather, side zipper, cushioned insole, rubber sole, versatile style', images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500'], category: 'fashion', stock: 50, slug: 'ankle-boots-leather' },
    { title: 'Yoga Leggings High-Waist', price: 44.99, mrp: 59.99, description: 'Squat-proof, moisture-wicking, 4-way stretch, phone pocket, flattering fit', images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500'], category: 'fashion', stock: 160, slug: 'yoga-leggings-highwaist' },
    { title: 'Silk Scarf Designer', price: 54.99, mrp: 74.99, description: '100% silk, hand-rolled edges, vibrant prints, versatile styling, luxury gift box', images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500'], category: 'fashion', stock: 65, slug: 'silk-scarf-designer' },
    { title: 'Baseball Cap Adjustable', price: 24.99, mrp: 34.99, description: 'Cotton twill, curved brim, adjustable strap, breathable, embroidered logo', images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500'], category: 'fashion', stock: 180, slug: 'baseball-cap-adjustable' },
    { title: 'Dress Watch Minimalist', price: 179.99, mrp: 229.99, description: 'Stainless steel, sapphire crystal, leather strap, water-resistant, Japanese movement', images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500'], category: 'fashion', stock: 45, slug: 'dress-watch-minimalist' },
    { title: 'Hooded Sweatshirt', price: 54.99, mrp: 69.99, description: 'Fleece-lined, kangaroo pocket, drawstring hood, ribbed cuffs, unisex fit', images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500'], category: 'fashion', stock: 130, slug: 'hooded-sweatshirt' },
    { title: 'Leather Wallet Bifold', price: 39.99, mrp: 54.99, description: 'Genuine leather, RFID blocking, 8 card slots, bill compartment, slim design', images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=500'], category: 'fashion', stock: 155, slug: 'leather-wallet-bifold' },
    { title: 'Summer Dress Floral', price: 79.99, mrp: 99.99, description: 'Lightweight cotton, flowy fit, adjustable straps, side pockets, machine washable', images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500'], category: 'fashion', stock: 75, slug: 'summer-dress-floral' },

    // ============ HOME & KITCHEN (12 products) ============
    { title: 'Stainless Steel Cookware Set', price: 199.99, mrp: 249.99, description: '10-piece set, dishwasher safe, induction compatible, tempered glass lids, lifetime warranty', images: ['https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500'], category: 'home-kitchen', stock: 25, slug: 'stainless-steel-cookware-set' },
    { title: 'Coffee Maker with Grinder', price: 149.99, mrp: 189.99, description: 'Built-in burr grinder, programmable timer, 12-cup capacity, auto shut-off, reusable filter', images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500'], category: 'home-kitchen', stock: 35, slug: 'coffee-maker-with-grinder' },
    { title: 'Memory Foam Pillow Set (2)', price: 59.99, mrp: 79.99, description: 'Hypoallergenic, cooling gel, washable cover, neck support, CertiPUR-US certified', images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500'], category: 'home-kitchen', stock: 100, slug: 'memory-foam-pillow-set-2' },
    { title: 'Robot Vacuum Cleaner', price: 299.99, mrp: 399.99, description: 'Smart navigation, app control, auto-charging, HEPA filter, 2000Pa suction, quiet operation', images: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500'], category: 'home-kitchen', stock: 20, slug: 'robot-vacuum-cleaner' },
    { title: 'Air Fryer 6-Quart', price: 119.99, mrp: 159.99, description: 'Digital touchscreen, 8 presets, non-stick basket, dishwasher safe, recipe book included', images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=500'], category: 'home-kitchen', stock: 55, slug: 'air-fryer-6quart' },
    { title: 'Blender High-Speed', price: 89.99, mrp: 119.99, description: '1200W motor, 64oz pitcher, pulse function, self-cleaning, BPA-free, 10-year warranty', images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=500'], category: 'home-kitchen', stock: 70, slug: 'blender-highspeed' },
    { title: 'Bed Sheet Set Queen', price: 49.99, mrp: 69.99, description: 'Egyptian cotton, 400 thread count, deep pockets, fade-resistant, 4-piece set', images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500'], category: 'home-kitchen', stock: 80, slug: 'bed-sheet-set-queen' },
    { title: 'Knife Set 15-Piece', price: 79.99, mrp: 109.99, description: 'German stainless steel, ergonomic handles, wooden block, sharpening steel, kitchen scissors', images: ['https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500'], category: 'home-kitchen', stock: 45, slug: 'knife-set-15piece' },
    { title: 'Towel Set 8-Piece', price: 44.99, mrp: 59.99, description: '100% cotton, quick-dry, soft and absorbent, fade-resistant, multiple colors available', images: ['https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=500'], category: 'home-kitchen', stock: 95, slug: 'towel-set-8piece' },
    { title: 'Instant Pot 8-Quart', price: 129.99, mrp: 169.99, description: '7-in-1 multi-cooker, pressure cooker, slow cooker, rice cooker, steamer, app-enabled', images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=500'], category: 'home-kitchen', stock: 40, slug: 'instant-pot-8quart' },
    { title: 'Dinnerware Set 16-Piece', price: 89.99, mrp: 119.99, description: 'Porcelain, chip-resistant, microwave safe, dishwasher safe, service for 4', images: ['https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500'], category: 'home-kitchen', stock: 60, slug: 'dinnerware-set-16piece' },
    { title: 'Electric Kettle Stainless', price: 39.99, mrp: 54.99, description: '1.7L capacity, rapid boil, auto shut-off, boil-dry protection, cordless serving', images: ['https://images.unsplash.com/photo-1563822249366-7dc65a32a82d?w=500'], category: 'home-kitchen', stock: 110, slug: 'electric-kettle-stainless' },

    // ============ BOOKS (8 products) ============
    { title: 'The Art of Programming', price: 49.99, mrp: 59.99, description: 'Comprehensive guide to software development best practices, algorithms, and design patterns', images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500'], category: 'books', stock: 150, slug: 'art-of-programming' },
    { title: 'Mindfulness & Meditation', price: 24.99, mrp: 29.99, description: 'Practical techniques for stress reduction, mental clarity, and inner peace', images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'], category: 'books', stock: 200, slug: 'mindfulness-meditation' },
    { title: 'World History Encyclopedia', price: 89.99, mrp: 119.99, description: 'Illustrated hardcover, 1000+ pages, comprehensive timeline from ancient to modern times', images: ['https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500'], category: 'books', stock: 50, slug: 'world-history-encyclopedia' },
    { title: 'Cooking Mastery Cookbook', price: 34.99, mrp: 44.99, description: '500+ recipes, step-by-step photos, techniques from beginner to advanced', images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500'], category: 'books', stock: 120, slug: 'cooking-mastery-cookbook' },
    { title: 'Financial Freedom Guide', price: 29.99, mrp: 39.99, description: 'Investment strategies, budgeting tips, wealth building for beginners', images: ['https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500'], category: 'books', stock: 180, slug: 'financial-freedom-guide' },
    { title: 'Science Fiction Collection', price: 44.99, mrp: 59.99, description: 'Box set of 5 classic sci-fi novels, award-winning authors, collector edition', images: ['https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500'], category: 'books', stock: 75, slug: 'scifi-collection' },
    { title: 'Photography Fundamentals', price: 39.99, mrp: 49.99, description: 'Master composition, lighting, editing - from smartphone to DSLR', images: ['https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=500'], category: 'books', stock: 95, slug: 'photography-fundamentals' },
    { title: 'Gardening Complete Guide', price: 32.99, mrp: 42.99, description: 'Indoor and outdoor gardening, plant care, seasonal planning, organic methods', images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500'], category: 'books', stock: 110, slug: 'gardening-complete-guide' },

    // ============ SPORTS & FITNESS (6 products) ============
    { title: 'Yoga Mat Premium', price: 39.99, mrp: 49.99, description: 'Non-slip, eco-friendly TPE, 6mm thick, includes carrying strap and bag', images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'], category: 'sports-fitness', stock: 120, slug: 'yoga-mat-premium' },
    { title: 'Adjustable Dumbbell Set', price: 249.99, mrp: 329.99, description: '5-52.5 lbs per dumbbell, space-saving design, quick adjustment dial', images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500'], category: 'sports-fitness', stock: 30, slug: 'adjustable-dumbbell-set' },
    { title: 'Resistance Bands Set', price: 29.99, mrp: 39.99, description: '5 bands, different resistance levels, portable, door anchor and handles included', images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500'], category: 'sports-fitness', stock: 150, slug: 'resistance-bands-set' },
    { title: 'Treadmill Folding', price: 599.99, mrp: 799.99, description: '12 programs, LCD display, heart rate monitor, 300lb capacity, space-saving design', images: ['https://images.unsplash.com/photo-1576678927484-cc907957088c?w=500'], category: 'sports-fitness', stock: 15, slug: 'treadmill-folding' },
    { title: 'Protein Powder 5lb', price: 54.99, mrp: 69.99, description: 'Whey isolate, 25g protein per serving, chocolate flavor, mixes easily', images: ['https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500'], category: 'sports-fitness', stock: 200, slug: 'protein-powder-5lb' },
    { title: 'Foam Roller Massage', price: 24.99, mrp: 34.99, description: 'High-density foam, muscle recovery, trigger point therapy, includes exercise guide', images: ['https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=500'], category: 'sports-fitness', stock: 140, slug: 'foam-roller-massage' },

    // ============ BEAUTY & PERSONAL CARE (8 products) ============
    { title: 'Skincare Gift Set', price: 79.99, mrp: 99.99, description: 'Cleanser, toner, moisturizer, serum - all natural ingredients, cruelty-free, vegan', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'], category: 'beauty-personal-care', stock: 60, slug: 'skincare-gift-set' },
    { title: 'Electric Hair Dryer Pro', price: 89.99, mrp: 119.99, description: 'Ionic technology, multiple heat settings, cool shot button, concentrator and diffuser', images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500'], category: 'beauty-personal-care', stock: 45, slug: 'electric-hair-dryer-pro' },
    { title: 'Fragrance Collection Set', price: 129.99, mrp: 159.99, description: '5 premium fragrances, 10ml each, travel-friendly, luxury gift box', images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=500'], category: 'beauty-personal-care', stock: 70, slug: 'fragrance-collection-set' },
    { title: 'Makeup Brush Set 20-Piece', price: 44.99, mrp: 59.99, description: 'Synthetic bristles, cruelty-free, ergonomic handles, includes case', images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500'], category: 'beauty-personal-care', stock: 85, slug: 'makeup-brush-set-20piece' },
    { title: 'Electric Toothbrush', price: 69.99, mrp: 89.99, description: 'Sonic technology, 5 modes, 2-minute timer, USB charging, 3 brush heads', images: ['https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500'], category: 'beauty-personal-care', stock: 100, slug: 'electric-toothbrush' },
    { title: 'Face Mask Set 12-Pack', price: 24.99, mrp: 34.99, description: 'Variety pack, hydrating, brightening, purifying, Korean beauty, sheet masks', images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500'], category: 'beauty-personal-care', stock: 130, slug: 'face-mask-set-12pack' },
    { title: 'Hair Straightener Ceramic', price: 59.99, mrp: 79.99, description: 'Adjustable temperature, ceramic plates, auto shut-off, fast heat-up, dual voltage', images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500'], category: 'beauty-personal-care', stock: 75, slug: 'hair-straightener-ceramic' },
    { title: 'Nail Care Kit Professional', price: 34.99, mrp: 44.99, description: '18-piece set, stainless steel tools, manicure and pedicure, leather case', images: ['https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=500'], category: 'beauty-personal-care', stock: 90, slug: 'nail-care-kit-professional' }
];

const marketplaceMeta = {
    electronics: {
        brands: ['PulseWave', 'AuroraTech', 'Northwind Labs', 'HyperNova'],
        highlights: [
            '1-year manufacturer warranty',
            'Exchange bonus on old devices',
            'Partner offers on select bank cards',
            'Trusted by 50K+ customers'
        ],
        specifications: [
            { label: 'Warranty', value: '12 Months' },
            { label: 'Fulfilled by', value: 'Zentro Logistics' },
            { label: 'Country of Origin', value: 'Imported / India' }
        ],
        variantOptions: { colors: ['Black', 'Silver', 'Blue'], sizes: [] },
        tags: ['electronics', 'gadgets', 'tech'],
        badges: ['Electronics Fest'],
        returnWindow: 7,
        shippingCharge: 0
    },
    fashion: {
        brands: ['ModaLane', 'Urban Thread', 'North Republic', 'Essence Co'],
        highlights: [
            'Premium quality fabrics',
            'Easy 15-day returns',
            'Pay later available',
            'Free size exchange'
        ],
        specifications: [
            { label: 'Fabric Care', value: 'Machine Wash' },
            { label: 'Fit', value: 'True to size' }
        ],
        variantOptions: { colors: ['Black', 'Olive', 'Sand', 'Navy'], sizes: ['S', 'M', 'L', 'XL'] },
        tags: ['fashion', 'style', 'clothing'],
        badges: ['Fresh on Zentro'],
        returnWindow: 15,
        shippingCharge: 0
    },
    'home-kitchen': {
        brands: ['CasaCraft', 'HomeLuxe', 'KitchenPro', 'ComfortBay'],
        highlights: [
            'Energy efficient design',
            'Tested for durability',
            'Extra warranty available',
            'Free installation on eligible items'
        ],
        specifications: [
            { label: 'Usage', value: 'Household' },
            { label: 'Warranty', value: '6-24 Months' }
        ],
        variantOptions: { colors: ['Steel', 'White', 'Charcoal'], sizes: [] },
        tags: ['home', 'kitchen', 'appliances'],
        badges: ['Top Home Pick'],
        returnWindow: 10,
        shippingCharge: 0
    },
    books: {
        brands: ['Zentro Press', 'Classic Reads', 'Aurora Publishing'],
        highlights: [
            'Author signed bookmark inside',
            'Eligible for buy 2 get 1',
            'Ships within 24 hours',
            'Quality checked packaging'
        ],
        specifications: [
            { label: 'Format', value: 'Paperback / Hardcover' },
            { label: 'Language', value: 'English' }
        ],
        variantOptions: { colors: [], sizes: [] },
        tags: ['books', 'reading'],
        badges: ['Editor\'s Pick'],
        returnWindow: 7,
        shippingCharge: 0
    },
    'sports-fitness': {
        brands: ['ActiveCore', 'Momentum', 'FitSphere'],
        highlights: [
            'Certified for professional use',
            'Sweat & weather resistant',
            'EMI starts ₹499/month equivalent',
            'Complimentary training plan'
        ],
        specifications: [
            { label: 'Ideal For', value: 'Unisex' },
            { label: 'Usage', value: 'Indoor + Outdoor' }
        ],
        variantOptions: { colors: ['Black', 'Grey', 'Teal'], sizes: ['S', 'M', 'L'] },
        tags: ['fitness', 'sports', 'wellness'],
        badges: ['Hot Selling'],
        returnWindow: 10,
        shippingCharge: 0
    },
    'beauty-personal-care': {
        brands: ['GlowLab', 'PureSkin', 'Aromatique'],
        highlights: [
            'Dermatologically tested',
            'Vegan & cruelty free',
            'Limited time combo offers',
            'Free travel pouch included'
        ],
        specifications: [
            { label: 'Skin Type', value: 'All skin types' },
            { label: 'Shelf Life', value: '24 Months' }
        ],
        variantOptions: { colors: [], sizes: [] },
        tags: ['beauty', 'personal care'],
        badges: ['Self Care Pick'],
        returnWindow: 7,
        shippingCharge: 0
    }
};

const defaultMeta = {
    brands: ['ZentroMall Originals'],
    highlights: ['Trusted by ZentroMall', 'Secure packaging', 'Easy returns'],
    specifications: [
        { label: 'Fulfilled by', value: 'ZentroMall' },
        { label: 'Customer Care', value: '24x7 Support' }
    ],
    variantOptions: { colors: ['Classic'], sizes: [] },
    tags: ['zentromall'],
    badges: ['Popular Choice'],
    returnWindow: 7,
    shippingCharge: 0
};

// Create a larger synthetic catalog (e.g. 2000 products) from the base marketplace products
const generateBulkProducts = (baseProducts, targetCount = 2000) => {
    const result = [];
    const total = Math.max(targetCount, baseProducts.length);

    for (let i = 0; i < total; i++) {
        const template = baseProducts[i % baseProducts.length];
        const index = i + 1;

        // Slight variations for realism
        const priceFactor = 0.85 + Math.random() * 0.4; // 0.85–1.25x
        const basePrice = template.price || 100;
        const price = Number((basePrice * priceFactor).toFixed(2));
        const mrpFactor = 1.05 + Math.random() * 0.4; // 1.05–1.45x
        const mrp = Number((price * mrpFactor).toFixed(2));

        const cloned = {
            ...template,
            title: `${template.title} #${index}`,
            slug: `${template.slug}-${index}`,
            price,
            mrp,
            stock: Math.max(5, Math.floor((template.stock || 50) * (0.4 + Math.random() * 1.6))),
            // Stagger flags to keep rails populated but varied
            isFeatured: i % 3 === 0,
            isBestSeller: i % 9 === 0,
            isDealOfDay: i % 7 === 0,
            isNewArrival: i > total - 100
        };

        result.push(cloned);
    }

    return result;
};

const enrichProductForMarketplace = (product, index) => {
    const meta = marketplaceMeta[product.category] || defaultMeta;
    const brand = meta.brands[index % meta.brands.length];
    const rating = Number((Math.random() * 1.2 + 3.8).toFixed(1));
    const numReviews = Math.floor(Math.random() * 900) + 40;
    const fastDelivery = Math.random() > 0.4;
    const badges = new Set(meta.badges);

    if (rating >= 4.5) badges.add('Top Rated');
    if (fastDelivery) badges.add('Fast Delivery');
    if (index % 7 === 0) badges.add('Limited Deal');

    const breakdown = {
        five: Math.floor(numReviews * 0.55),
        four: Math.floor(numReviews * 0.25),
        three: Math.floor(numReviews * 0.12),
        two: Math.floor(numReviews * 0.05),
        one: 0
    };
    breakdown.one = numReviews - (breakdown.five + breakdown.four + breakdown.three + breakdown.two);

    return {
        ...product,
        categorySlug: product.category,
        brand,
        highlights: meta.highlights.slice(0, 4),
        specifications: meta.specifications,
        variantOptions: meta.variantOptions,
        badges: Array.from(badges),
        tags: Array.from(new Set([...(product.tags || []), ...meta.tags, ...product.title.toLowerCase().split(' ')])),
        deliveryInfo: {
            fastDelivery,
            cod: true,
            returnWindow: meta.returnWindow,
            shippingCharge: meta.shippingCharge,
            estimatedDays: fastDelivery ? 'Tomorrow' : '2-4 days'
        },
        isFeatured: index % 3 === 0,
        isBestSeller: numReviews > 500,
        isDealOfDay: index % 5 === 0,
        isNewArrival: index > products.length - 15,
        rating,
        numReviews,
        ratingBreakdown: breakdown
    };
};

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});
        console.log('Cleared existing data');

        // Create a default seller user (we'll use a regular user with seller role for simplicity)
        let seller = await User.findOne({ email: 'seller@zentromall.com' });
        if (!seller) {
            seller = await User.create({
                name: 'ZentroMall Official',
                email: 'seller@zentromall.com',
                password: 'seller123', // This will be hashed by the User model
                role: 'seller'
            });
            console.log('Created default seller user');
        }

        // Insert categories
        const createdCategories = await Category.insertMany(categories);
        console.log(`Inserted ${createdCategories.length} categories`);

        // Map category slugs to IDs
        const categoryMap = {};
        createdCategories.forEach(cat => {
            categoryMap[cat.slug] = cat._id;
        });

        // Enrich base products with marketplace meta
        const marketplaceProducts = products.map(enrichProductForMarketplace);

        // Expand to a larger synthetic catalog (≈2000 products)
        const expandedMarketplaceProducts = generateBulkProducts(marketplaceProducts, 2000);

        // Update products with category IDs and seller ID
        const productsWithCategories = expandedMarketplaceProducts.map(product => {
            const categoryId = categoryMap[product.categorySlug];
            if (!categoryId) {
                throw new Error(`Missing category for slug ${product.categorySlug}`);
            }

            const { categorySlug, ...rest } = product;
            return {
                ...rest,
                category: categoryId,
                seller: seller._id
            };
        });

        // Insert products
        const createdProducts = await Product.insertMany(productsWithCategories);
        console.log(`Inserted ${createdProducts.length} products`);

        console.log('✅ Database seeded successfully!');
        console.log(`\nYou can now login as seller with:`);
        console.log(`Email: seller@zentromall.com`);
        console.log(`Password: seller123`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
