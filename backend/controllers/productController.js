const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

<<<<<<< HEAD
// @desc    Fetch all products with filtering and sorting
=======
const parseCsvParam = (value = '') => value.split(',').map(item => item.trim()).filter(Boolean);

const resolveCategoryFilter = async (rawCategories) => {
    if (!rawCategories) return null;

    const tokens = parseCsvParam(rawCategories);
    if (!tokens.length) return null;

    const ids = tokens.filter(token => mongoose.Types.ObjectId.isValid(token));
    const slugs = tokens.filter(token => !mongoose.Types.ObjectId.isValid(token));

    if (slugs.length) {
        const slugMatches = await Category.find({ slug: { $in: slugs } }).select('_id');
        slugMatches.forEach(doc => ids.push(doc._id));
    }

    return ids.length ? ids : null;
};

const buildSortOption = (sortKey = 'relevance') => {
    const map = {
        'price-asc': { price: 1 },
        'price-desc': { price: -1 },
        'rating': { rating: -1, numReviews: -1 },
        'newest': { createdAt: -1 },
        'best-selling': { isBestSeller: -1, numReviews: -1 },
        'discount': { discount: -1 },
    };
    return map[sortKey] || { tagsPriority: -1, createdAt: -1 };
};

// @desc    Fetch all products with marketplace style filters
>>>>>>> d74150c8c94d3a37aa361654c5eaec6406af0ac1
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const {
            keyword,
<<<<<<< HEAD
            category,
            minPrice,
            maxPrice,
            brand,
            rating,
            inStock,
            sortBy,
            page = 1,
            limit = 12
        } = req.query;

        // Build filter object
        let filter = { status: 'active' };

        // Keyword search
        if (keyword) {
            filter.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { tags: { $in: [new RegExp(keyword, 'i')] } }
            ];
        }

        // Category filter
        if (category) {
            filter.category = category;
        }

        // Price range filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // Brand filter (supports multiple brands)
        if (brand) {
            const brands = Array.isArray(brand) ? brand : [brand];
            filter.brand = { $in: brands };
        }

        // Rating filter
        if (rating) {
            filter.rating = { $gte: Number(rating) };
        }

        // Stock availability filter
        if (inStock === 'true') {
            filter.stock = { $gt: 0 };
        }

        // Sorting
        let sort = {};
        switch (sortBy) {
            case 'price-asc':
                sort = { price: 1 };
                break;
            case 'price-desc':
                sort = { price: -1 };
                break;
            case 'rating':
                sort = { rating: -1 };
                break;
            case 'newest':
                sort = { createdAt: -1 };
                break;
            case 'discount':
                sort = { discount: -1 };
                break;
            case 'popular':
                sort = { viewCount: -1, numReviews: -1 };
                break;
            default:
                sort = { createdAt: -1 };
        }

        // Pagination
        const skip = (page - 1) * limit;

        // Execute query
        const products = await Product.find(filter)
            .populate('category', 'name')
            .sort(sort)
            .limit(Number(limit))
            .skip(skip);

        // Get total count for pagination
        const total = await Product.countDocuments(filter);

        res.json({
            products,
            page: Number(page),
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        console.error('Error in getProducts:', error);
=======
            brand,
            minPrice,
            maxPrice,
            rating,
            tags,
            sort,
            page = 1,
            limit = 20,
            fastDelivery,
            deal,
            featured
        } = req.query;

        const parsedLimit = Math.min(parseInt(limit, 10) || 20, 50);
        const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
        const skip = (parsedPage - 1) * parsedLimit;

        const query = { status: 'active' };

        if (keyword) {
            const regex = new RegExp(keyword, 'i');
            query.$or = [
                { title: regex },
                { description: regex },
                { brand: regex },
                { tags: regex }
            ];
        }

        const categoryFilter = await resolveCategoryFilter(req.query.category);
        if (categoryFilter) {
            query.category = { $in: categoryFilter };
        }

        if (brand) {
            query.brand = { $in: parseCsvParam(brand) };
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (rating) {
            query.rating = { $gte: Number(rating) };
        }

        if (tags) {
            query.tags = { $in: parseCsvParam(tags) };
        }

        if (fastDelivery === 'true') {
            query['deliveryInfo.fastDelivery'] = true;
        }

        if (deal === 'true') {
            query.isDealOfDay = true;
        }

        if (featured === 'true') {
            query.isFeatured = true;
        }

        const [products, total] = await Promise.all([
            Product.find(query)
                .populate('category', 'name slug')
                .skip(skip)
                .limit(parsedLimit)
                .sort(buildSortOption(sort)),
            Product.countDocuments(query)
        ]);

        res.json({
            products,
            pagination: {
                total,
                page: parsedPage,
                pages: Math.ceil(total / parsedLimit),
                limit: parsedLimit
            },
            appliedFilters: {
                keyword: keyword || null,
                brand: brand ? parseCsvParam(brand) : [],
                category: categoryFilter,
                minPrice: minPrice ? Number(minPrice) : null,
                maxPrice: maxPrice ? Number(maxPrice) : null,
                rating: rating ? Number(rating) : null
            }
        });
    } catch (error) {
        console.error('getProducts error:', error);
>>>>>>> d74150c8c94d3a37aa361654c5eaec6406af0ac1
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single product with related picks
// @route   GET /api/products/:slug
// @access  Public
const getProductBySlug = async (req, res) => {
    try {
        console.log('Fetching product with slug:', req.params.slug);

        const product = await Product.findOne({ slug: req.params.slug })
<<<<<<< HEAD
            .populate('category', 'name')
            .populate({ path: 'seller', select: 'name', strictPopulate: false });

        console.log('Product found:', product ? 'Yes' : 'No');
=======
            .populate('category', 'name slug')
            .populate({ path: 'seller', select: 'storeName', strictPopulate: false });
>>>>>>> d74150c8c94d3a37aa361654c5eaec6406af0ac1

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const related = await Product.find({
            _id: { $ne: product._id },
            category: product.category?._id || product.category,
            status: 'active'
        })
            .limit(8)
            .select('title price slug images rating brand isBestSeller');

        const response = product.toObject();
        response.relatedProducts = related;
        res.json(response);
    } catch (error) {
        console.error('Error in getProductBySlug:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ message: error.message, error: error.toString() });
    }
};

// @desc    Return marketplace featured rails (hero/deals/bestsellers)
// @route   GET /api/products/collections/featured
// @access  Public
const getFeaturedCollections = async (_req, res) => {
    try {
        const [dealsOfDay, bestSellers, newArrivals, topRated, curatedCategories] = await Promise.all([
            Product.find({ isDealOfDay: true, status: 'active' }).limit(12).select('title price mrp discount slug images rating brand badges'),
            Product.find({ isBestSeller: true, status: 'active' }).limit(12).select('title price slug images rating brand badges numReviews'),
            Product.find({ status: 'active' }).sort({ createdAt: -1 }).limit(12).select('title price slug images rating brand badges'),
            Product.find({ rating: { $gte: 4 }, status: 'active' }).limit(12).select('title price slug images rating brand badges'),
            Category.find({}).limit(8).select('name slug image')
        ]);

        const heroBanners = [
            {
                id: 'electronics',
                title: 'Mega Electronics Fest',
                subtitle: 'Laptops, mobiles & accessories starting under $299',
                ctaLabel: 'Shop Electronics',
                ctaLink: '/shop?category=electronics',
                image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1600',
                accent: '#1e90ff'
            },
            {
                id: 'fashion',
                title: 'Premium Fashion Deals',
                subtitle: 'Top brands with extra 20% cashback this weekend',
                ctaLabel: 'Upgrade Wardrobe',
                ctaLink: '/shop?category=fashion',
                image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600',
                accent: '#ff5f6d'
            },
            {
                id: 'home',
                title: 'Home & Kitchen Essentials',
                subtitle: 'Cookware, decor & smart appliances for modern living',
                ctaLabel: 'Refresh Home',
                ctaLink: '/shop?category=home-kitchen',
                image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=1600',
                accent: '#2dd4bf'
            }
        ];

        res.json({
            heroBanners,
            dealsOfDay,
            bestSellers,
            newArrivals,
            topRated,
            curatedCategories,
            trendingSearches: ['Wireless earbuds', 'Air fryer', 'Gaming laptops', 'Fitness bands', 'Robot vacuum']
        });
    } catch (error) {
        console.error('getFeaturedCollections error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Marketplace filter metadata (categories, brands, price range)
// @route   GET /api/products/filters/meta
// @access  Public
const getProductFiltersMeta = async (_req, res) => {
    try {
        const [categories, brands, priceStats] = await Promise.all([
            Category.find({}).select('name slug image'),
            Product.distinct('brand', { status: 'active' }),
            Product.aggregate([
                { $match: { status: 'active' } },
                {
                    $group: {
                        _id: null,
                        minPrice: { $min: '$price' },
                        maxPrice: { $max: '$price' }
                    }
                }
            ])
        ]);

        const { minPrice = 0, maxPrice = 0 } = priceStats[0] || {};

        res.json({
            categories,
            brands: brands.filter(Boolean).sort(),
            priceRange: { min: Math.floor(minPrice), max: Math.ceil(maxPrice) },
            ratingBuckets: [4.5, 4, 3],
            dealFilters: ['fastDelivery', 'bestSeller', 'dealOfDay']
        });
    } catch (error) {
        console.error('getProductFiltersMeta error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Lightweight search suggestions
// @route   GET /api/products/search/suggestions
// @access  Public
const getSearchSuggestions = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.json([]);
        }

        const regex = new RegExp(q, 'i');
        const suggestions = await Product.find({
            status: 'active',
            $or: [{ title: regex }, { brand: regex }, { tags: regex }]
        })
            .limit(8)
            .select('title slug brand category');

        res.json(suggestions);
    } catch (error) {
        console.error('getSearchSuggestions error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin/Seller
const createProduct = async (req, res) => {
    try {
        const product = new Product({
            ...req.body,
            seller: req.user.role === 'seller' ? req.user._id : req.body.seller
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in seller's products
// @route   GET /api/products/myproducts
// @access  Private/Seller
const getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({ seller: req.user._id }).populate('category', 'name');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

<<<<<<< HEAD
// @desc    Get available filter options
// @route   GET /api/products/filters
// @access  Public
const getFilterOptions = async (req, res) => {
    try {
        // Get unique brands
        const brands = await Product.distinct('brand', { brand: { $ne: '' } });

        // Get price range
        const priceRange = await Product.aggregate([
            { $match: { status: 'active' } },
            {
                $group: {
                    _id: null,
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            }
        ]);

        // Get available sizes and colors
        const sizes = await Product.distinct('availableSizes');
        const colors = await Product.distinct('availableColors');

        res.json({
            brands: brands.sort(),
            priceRange: priceRange[0] || { minPrice: 0, maxPrice: 10000 },
            sizes: sizes.filter(s => s).sort(),
            colors: colors.filter(c => c).sort()
        });
    } catch (error) {
        console.error('Error in getFilterOptions:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get product recommendations
// @route   GET /api/products/:id/recommendations
// @access  Public
const getRecommendations = async (req, res) => {
    try {
        const { id } = req.params;
        const limit = parseInt(req.query.limit) || 8;

        // Get the current product
        const currentProduct = await Product.findById(id);
        if (!currentProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find similar products based on:
        // 1. Same category
        // 2. Similar tags
        // 3. Similar price range
        const recommendations = await Product.aggregate([
            {
                $match: {
                    _id: { $ne: currentProduct._id },
                    status: 'active',
                    $or: [
                        { category: currentProduct.category },
                        { tags: { $in: currentProduct.tags || [] } },
                        {
                            price: {
                                $gte: currentProduct.price * 0.7,
                                $lte: currentProduct.price * 1.3
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    // Calculate similarity score
                    similarityScore: {
                        $add: [
                            // Same category: +10 points
                            { $cond: [{ $eq: ['$category', currentProduct.category] }, 10, 0] },
                            // Each matching tag: +5 points
                            {
                                $multiply: [
                                    { $size: { $setIntersection: ['$tags', currentProduct.tags || []] } },
                                    5
                                ]
                            },
                            // Similar price: +3 points
                            {
                                $cond: [
                                    {
                                        $and: [
                                            { $gte: ['$price', currentProduct.price * 0.8] },
                                            { $lte: ['$price', currentProduct.price * 1.2] }
                                        ]
                                    },
                                    3,
                                    0
                                ]
                            },
                            // Higher rating: bonus points
                            { $multiply: ['$rating', 0.5] }
                        ]
                    }
                }
            },
            { $sort: { similarityScore: -1, rating: -1, numReviews: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } }
        ]);

        res.json(recommendations);
    } catch (error) {
        console.error('Error in getRecommendations:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProducts, getProductBySlug, createProduct, deleteProduct, getMyProducts, getFilterOptions, getRecommendations };
=======
module.exports = {
    getProducts,
    getProductBySlug,
    getFeaturedCollections,
    getProductFiltersMeta,
    getSearchSuggestions,
    createProduct,
    deleteProduct,
    getMyProducts
};
>>>>>>> d74150c8c94d3a37aa361654c5eaec6406af0ac1
