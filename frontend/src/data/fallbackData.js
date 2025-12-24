'use client';

export const FALLBACK_PRODUCTS = [
  {
    title: 'Wireless Bluetooth Headphones',
    slug: 'wireless-bluetooth-headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life, deep bass, and crystal clear sound.',
    brand: 'PulseWave',
    price: 79.99,
    mrp: 99.99,
    discount: 20,
    category: { name: 'Electronics', slug: 'electronics' },
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
    rating: 4.6,
    numReviews: 820,
    highlights: ['30-hour battery life', 'Hybrid ANC + transparency', 'Dual device pairing'],
    specifications: [
      { label: 'Warranty', value: '12 Months' },
      { label: 'Noise Cancellation', value: 'Active' }
    ],
    variantOptions: { colors: ['Black', 'Silver'], sizes: [] },
    badges: ['Electronics Fest'],
    deliveryInfo: { fastDelivery: true, cod: true, returnWindow: 7, shippingCharge: 0, estimatedDays: 'Tomorrow' },
    seller: { storeName: 'ZentroMall Official' }
  },
  {
    title: 'Smart Watch Series 7',
    slug: 'smart-watch-series-7',
    description: 'Advanced fitness tracking, heart rate monitor, GPS, water resistant, sleep tracking, 50+ workout modes.',
    brand: 'AuroraTech',
    price: 399.99,
    mrp: 499.99,
    discount: 20,
    category: { name: 'Electronics', slug: 'electronics' },
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
    rating: 4.7,
    numReviews: 640,
    highlights: ['Always-on display', 'SpO2 + ECG', '1-week battery life'],
    specifications: [
      { label: 'Case Size', value: '44mm' },
      { label: 'Water Resistance', value: '5 ATM' }
    ],
    variantOptions: { colors: ['Midnight', 'Starlight'], sizes: ['S/M', 'M/L'] },
    badges: ['Top Rated'],
    deliveryInfo: { fastDelivery: true, cod: true, returnWindow: 7, shippingCharge: 0, estimatedDays: '2 days' },
    seller: { storeName: 'ZentroMall Official' }
  },
  {
    title: 'Portable Bluetooth Speaker',
    slug: 'portable-bluetooth-speaker',
    description: '360° sound, 20-hour battery, waterproof IPX7, deep bass, USB-C charging.',
    brand: 'PulseWave',
    price: 89.99,
    mrp: 119.99,
    discount: 25,
    category: { name: 'Electronics', slug: 'electronics' },
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800'],
    rating: 4.6,
    numReviews: 510,
    highlights: ['IPX7 waterproof', 'PartyBoost stereo', 'Built-in power bank'],
    specifications: [
      { label: 'Battery Life', value: '20 hours' },
      { label: 'Connectivity', value: 'Bluetooth 5.3' }
    ],
    variantOptions: { colors: ['Graphite', 'Teal'], sizes: [] },
    badges: ['Hot Selling'],
    deliveryInfo: { fastDelivery: true, cod: true, returnWindow: 10, shippingCharge: 0, estimatedDays: 'Tomorrow' },
    seller: { storeName: 'PulseWave Store' }
  },
  {
    title: 'Classic Denim Jacket',
    slug: 'classic-denim-jacket',
    description: 'Vintage wash, 100% cotton, unisex fit, button closure, chest pockets, timeless style.',
    brand: 'Urban Thread',
    price: 89.99,
    mrp: 119.99,
    discount: 25,
    category: { name: 'Fashion', slug: 'fashion' },
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'],
    rating: 4.5,
    numReviews: 410,
    highlights: ['Vintage wash finish', 'Reinforced seams', 'Limited edition badges'],
    specifications: [
      { label: 'Fabric', value: '100% Cotton' },
      { label: 'Care', value: 'Machine wash cold' }
    ],
    variantOptions: { colors: ['Indigo', 'Washed Black'], sizes: ['S', 'M', 'L', 'XL'] },
    badges: ['Fresh on Zentro'],
    deliveryInfo: { fastDelivery: false, cod: true, returnWindow: 15, shippingCharge: 0, estimatedDays: '3-5 days' },
    seller: { storeName: 'Urban Thread' }
  },
  {
    title: 'Robot Vacuum Cleaner',
    slug: 'robot-vacuum-cleaner',
    description: 'Smart navigation, app control, auto-charging, HEPA filter, 2000Pa suction, quiet operation.',
    brand: 'HomeLuxe',
    price: 299.99,
    mrp: 399.99,
    discount: 25,
    category: { name: 'Home & Kitchen', slug: 'home-kitchen' },
    images: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800'],
    rating: 4.8,
    numReviews: 290,
    highlights: ['LiDAR mapping', 'Auto dirt disposal ready', 'Voice assistant support'],
    specifications: [
      { label: 'Battery', value: '120 mins runtime' },
      { label: 'Suction', value: '2000Pa' }
    ],
    variantOptions: { colors: ['White', 'Black'], sizes: [] },
    badges: ['Top Rated'],
    deliveryInfo: { fastDelivery: false, cod: true, returnWindow: 7, shippingCharge: 0, estimatedDays: '3 days' },
    seller: { storeName: 'HomeLuxe' }
  },
  {
    title: 'Yoga Mat Premium',
    slug: 'yoga-mat-premium',
    description: 'Non-slip, eco-friendly TPE, 6mm thick, includes carrying strap and bag.',
    brand: 'ActiveCore',
    price: 39.99,
    mrp: 49.99,
    discount: 20,
    category: { name: 'Sports & Fitness', slug: 'sports-fitness' },
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800'],
    rating: 4.7,
    numReviews: 220,
    highlights: ['Eco-friendly TPE', '6mm cushioning', 'Includes carry strap'],
    specifications: [
      { label: 'Thickness', value: '6mm' },
      { label: 'Dimensions', value: '183 x 61 cm' }
    ],
    variantOptions: { colors: ['Charcoal', 'Teal'], sizes: [] },
    badges: ['Hot Selling'],
    deliveryInfo: { fastDelivery: true, cod: true, returnWindow: 10, shippingCharge: 0, estimatedDays: 'Tomorrow' },
    seller: { storeName: 'ActiveCore' }
  }
];

export const FALLBACK_META = {
  categories: [
    { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800' },
    { name: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800' },
    { name: 'Home & Kitchen', slug: 'home-kitchen', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800' },
    { name: 'Sports & Fitness', slug: 'sports-fitness', image: 'https://images.unsplash.com/photo-1420310414923-bf3651a89816?w=800' }
  ],
  brands: ['PulseWave', 'AuroraTech', 'Urban Thread', 'HomeLuxe', 'ActiveCore'],
  priceRange: { min: 39, max: 399 },
  ratingBuckets: [4.5, 4, 3],
  dealFilters: ['fastDelivery', 'bestSeller', 'dealOfDay']
};

export const FALLBACK_COLLECTIONS = {
  heroBanners: [
    {
      id: 'electronics',
      title: 'Mega Electronics Fest',
      subtitle: 'Laptops, mobiles & accessories starting under $299',
      ctaLabel: 'Shop Electronics',
      ctaLink: '/shop?category=electronics',
      image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1600'
    },
    {
      id: 'fashion',
      title: 'Premium Fashion Deals',
      subtitle: 'Top brands with extra 20% cashback this weekend',
      ctaLabel: 'Upgrade Wardrobe',
      ctaLink: '/shop?category=fashion',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600'
    }
  ],
  dealsOfDay: FALLBACK_PRODUCTS.slice(0, 2),
  bestSellers: FALLBACK_PRODUCTS.slice(0, 2),
  newArrivals: FALLBACK_PRODUCTS.slice(2, 4),
  topRated: FALLBACK_PRODUCTS.slice(4, 6),
  curatedCategories: [
    { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800' },
    { name: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800' },
    { name: 'Home & Kitchen', slug: 'home-kitchen', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800' },
    { name: 'Sports & Fitness', slug: 'sports-fitness', image: 'https://images.unsplash.com/photo-1420310414923-bf3651a89816?w=800' }
  ],
  trendingSearches: ['Wireless earbuds', 'Robot vacuum', 'Denim jackets', 'Air fryer combo']
};

export const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/600x600?text=Image+Not+Available';
