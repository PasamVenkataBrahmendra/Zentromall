/**
 * Kaggle Analytics Controller
 * API endpoints to access Kaggle dataset insights and analytics
 */

const KaggleDataManager = require('../utils/kaggleDataManager');
const Product = require('../models/Product');

// Get dataset statistics
exports.getDatasetStats = async (req, res) => {
    try {
        const stats = await KaggleDataManager.getDatasetStats();
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get products from specific Kaggle source
exports.getProductsBySource = async (req, res) => {
    try {
        const { source, limit = 10, skip = 0 } = req.query;
        
        if (!source) {
            return res.status(400).json({
                success: false,
                message: 'Source parameter is required'
            });
        }

        const products = await KaggleDataManager.getProductsBySource(
            source,
            parseInt(limit),
            parseInt(skip)
        );

        res.status(200).json({
            success: true,
            source,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get top-rated products from Kaggle datasets
exports.getTopRatedProducts = async (req, res) => {
    try {
        const { minRating = 4.5, limit = 20 } = req.query;

        const products = await KaggleDataManager.getTopRatedProducts(
            parseFloat(minRating),
            parseInt(limit)
        );

        res.status(200).json({
            success: true,
            minRating,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get review analysis
exports.getReviewAnalysis = async (req, res) => {
    try {
        const { source } = req.query;

        if (!source) {
            return res.status(400).json({
                success: false,
                message: 'Source parameter is required'
            });
        }

        const analysis = await KaggleDataManager.getReviewAnalysis(source);

        res.status(200).json({
            success: true,
            source,
            data: analysis
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Compare all Kaggle datasets
exports.compareDatasets = async (req, res) => {
    try {
        const comparison = await KaggleDataManager.compareDatasets();

        res.status(200).json({
            success: true,
            data: comparison
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get trending products
exports.getTrendingProducts = async (req, res) => {
    try {
        const { days = 30, limit = 20 } = req.query;

        const products = await KaggleDataManager.getTrendingProducts(
            parseInt(days),
            parseInt(limit)
        );

        res.status(200).json({
            success: true,
            days,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get category analysis
exports.getCategoryAnalysis = async (req, res) => {
    try {
        const analysis = await KaggleDataManager.getCategoryAnalysis();

        res.status(200).json({
            success: true,
            count: analysis.length,
            data: analysis
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get brand analysis
exports.getBrandAnalysis = async (req, res) => {
    try {
        const analysis = await KaggleDataManager.getBrandAnalysis();

        res.status(200).json({
            success: true,
            count: analysis.length,
            data: analysis
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Find similar products
exports.getSimilarProducts = async (req, res) => {
    try {
        const { productId, limit = 5 } = req.query;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'productId parameter is required'
            });
        }

        const products = await KaggleDataManager.findSimilarProducts(
            productId,
            parseInt(limit)
        );

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get products by price range
exports.getProductsByPrice = async (req, res) => {
    try {
        const { minPrice, maxPrice, limit = 20 } = req.query;

        if (!minPrice || !maxPrice) {
            return res.status(400).json({
                success: false,
                message: 'minPrice and maxPrice parameters are required'
            });
        }

        const products = await KaggleDataManager.getProductsByPrice(
            parseFloat(minPrice),
            parseFloat(maxPrice),
            parseInt(limit)
        );

        res.status(200).json({
            success: true,
            priceRange: { min: minPrice, max: maxPrice },
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all available Kaggle sources
exports.getAvailableSources = async (req, res) => {
    try {
        const sources = await Product.distinct('source', { source: /kaggle-/ });

        res.status(200).json({
            success: true,
            count: sources.length,
            data: sources
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Kaggle dataset overview
exports.getDatasetOverview = async (req, res) => {
    try {
        const totalKaggleProducts = await Product.countDocuments({ source: /kaggle-/ });
        const sources = await Product.distinct('source', { source: /kaggle-/ });
        const avgRating = await Product.aggregate([
            { $match: { source: /kaggle-/ } },
            { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ]);

        res.status(200).json({
            success: true,
            overview: {
                totalProducts: totalKaggleProducts,
                totalSources: sources.length,
                availableSources: sources,
                averageRating: avgRating[0]?.avgRating?.toFixed(2) || 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
