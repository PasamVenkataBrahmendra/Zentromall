/**
 * Search Controller
 * Handles product search, filtering, and autocomplete suggestions
 */

const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Search products with full-text search
// @route   GET /api/search
// @access  Public
const searchProducts = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, sort, limit = 20, page = 1 } = req.query;

    let query = {};

    // Text search
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Build sort
    let sortBy = {};
    if (sort) {
      switch (sort) {
        case 'price_low_high':
          sortBy = { price: 1 };
          break;
        case 'price_high_low':
          sortBy = { price: -1 };
          break;
        case 'newest':
          sortBy = { createdAt: -1 };
          break;
        case 'popular':
          sortBy = { numReviews: -1, rating: -1 };
          break;
        case 'rating':
          sortBy = { rating: -1 };
          break;
        default:
          sortBy = { createdAt: -1 };
      }
    } else {
      sortBy = { createdAt: -1 };
    }

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = Math.min(parseInt(limit) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const products = await Product.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum)
      .populate('category', 'name slug')
      .lean();

    const total = await Product.countDocuments(query);

    res.json({
      data: products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get autocomplete suggestions
// @route   GET /api/search/suggestions
// @access  Public
const getAutocompleteSuggestions = async (req, res) => {
  try {
    const { q, type = 'products' } = req.query;

    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }

    const suggestions = [];

    if (type === 'products' || type === 'all') {
      // Product suggestions
      const products = await Product.find(
        { title: { $regex: q, $options: 'i' } },
        { title: 1, slug: 1, images: 1, price: 1 }
      )
        .limit(5)
        .lean();

      suggestions.push(
        ...products.map((p) => ({
          id: p._id,
          type: 'product',
          title: p.title,
          slug: p.slug,
          image: p.images?.[0],
          price: p.price,
          icon: '📦'
        }))
      );
    }

    if (type === 'categories' || type === 'all') {
      // Category suggestions
      const categories = await Category.find(
        { name: { $regex: q, $options: 'i' } },
        { name: 1, slug: 1, image: 1 }
      )
        .limit(5)
        .lean();

      suggestions.push(
        ...categories.map((c) => ({
          id: c._id,
          type: 'category',
          title: c.name,
          slug: c.slug,
          image: c.image,
          icon: '📂'
        }))
      );
    }

    if (type === 'brands' || type === 'all') {
      // Brand suggestions (from product tags)
      const brands = await Product.aggregate([
        {
          $match: {
            tags: { $regex: q, $options: 'i' }
          }
        },
        {
          $unwind: '$tags'
        },
        {
          $match: {
            tags: { $regex: q, $options: 'i' }
          }
        },
        {
          $group: {
            _id: '$tags',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 5
        }
      ]);

      suggestions.push(
        ...brands.map((b) => ({
          id: b._id,
          type: 'brand',
          title: b._id,
          count: b.count,
          icon: '🏷️'
        }))
      );
    }

    // Search queries
    if (type === 'all') {
      suggestions.push({
        type: 'search',
        title: q,
        count: await Product.countDocuments({
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } }
          ]
        }),
        icon: '🔍'
      });
    }

    res.json({ suggestions: suggestions.slice(0, 10) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get search filters (categories, price range, etc.)
// @route   GET /api/search/filters
// @access  Public
const getSearchFilters = async (req, res) => {
  try {
    const { q } = req.query;

    let matchStage = {};
    if (q) {
      matchStage = {
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } }
        ]
      };
    }

    // Get categories
    const categories = await Product.aggregate([
      { $match: matchStage },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryData'
        }
      }
    ]);

    // Get price range
    const priceRange = await Product.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    // Get ratings
    const ratings = [
      { rating: '4★ & above', value: 4 },
      { rating: '3★ & above', value: 3 },
      { rating: '2★ & above', value: 2 },
      { rating: '1★ & above', value: 1 }
    ];

    // Get brands (from tags)
    const brands = await Product.aggregate([
      { $match: matchStage },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      categories: categories.map((c) => ({
        _id: c._id,
        name: c.categoryData[0]?.name || 'Unknown',
        count: c.count
      })),
      priceRange: priceRange[0] || { minPrice: 0, maxPrice: 100000 },
      ratings,
      brands: brands.map((b) => ({ name: b._id, count: b.count }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get trending searches
// @route   GET /api/search/trending
// @access  Public
const getTrendingSearches = async (req, res) => {
  try {
    // In production, you'd track searches in a separate collection
    // For now, return popular product titles
    const trending = await Product.aggregate([
      { $sort: { numReviews: -1 } },
      { $limit: 10 },
      { $project: { title: 1 } }
    ]);

    res.json({
      trending: trending.map((t) => t.title)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  searchProducts,
  getAutocompleteSuggestions,
  getSearchFilters,
  getTrendingSearches
};
