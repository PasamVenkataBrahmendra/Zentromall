const Product = require('../models/Product');

// @desc    Fetch all products with filtering and sorting
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const {
            keyword,
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
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:slug
// @access  Public
const getProductBySlug = async (req, res) => {
    try {
        console.log('Fetching product with slug:', req.params.slug);

        const product = await Product.findOne({ slug: req.params.slug })
            .populate('category', 'name')
            .populate({ path: 'seller', select: 'name', strictPopulate: false });

        console.log('Product found:', product ? 'Yes' : 'No');

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error in getProductBySlug:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ message: error.message, error: error.toString() });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin/Seller
const createProduct = async (req, res) => {
    try {
        const product = new Product({
            ...req.body,
            seller: req.user.role === 'seller' ? req.user._id : req.body.seller // If seller, use their ID
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
