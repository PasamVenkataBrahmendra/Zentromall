/**
 * Kaggle Analytics Routes
 * API endpoints for accessing Kaggle dataset insights
 */

const express = require('express');
const router = express.Router();
const kaggleAnalyticsController = require('../controllers/kaggleAnalyticsController');

// ============ DATASET OVERVIEW ============

// GET /api/kaggle/overview - Get overall Kaggle dataset statistics
router.get('/overview', kaggleAnalyticsController.getDatasetOverview);

// GET /api/kaggle/stats - Get detailed statistics by source
router.get('/stats', kaggleAnalyticsController.getDatasetStats);

// GET /api/kaggle/sources - Get all available Kaggle sources
router.get('/sources', kaggleAnalyticsController.getAvailableSources);

// ============ PRODUCTS ============

// GET /api/kaggle/products/by-source - Get products from specific Kaggle source
// Query params: source, limit, skip
router.get('/products/by-source', kaggleAnalyticsController.getProductsBySource);

// GET /api/kaggle/products/top-rated - Get highest-rated Kaggle products
// Query params: minRating, limit
router.get('/products/top-rated', kaggleAnalyticsController.getTopRatedProducts);

// GET /api/kaggle/products/trending - Get trending products
// Query params: days, limit
router.get('/products/trending', kaggleAnalyticsController.getTrendingProducts);

// GET /api/kaggle/products/price-range - Get products in price range
// Query params: minPrice, maxPrice, limit
router.get('/products/price-range', kaggleAnalyticsController.getProductsByPrice);

// GET /api/kaggle/products/similar - Find similar products
// Query params: productId, limit
router.get('/products/similar', kaggleAnalyticsController.getSimilarProducts);

// ============ ANALYTICS ============

// GET /api/kaggle/analytics/reviews - Get review analysis for source
// Query params: source
router.get('/analytics/reviews', kaggleAnalyticsController.getReviewAnalysis);

// GET /api/kaggle/analytics/categories - Get category analysis
router.get('/analytics/categories', kaggleAnalyticsController.getCategoryAnalysis);

// GET /api/kaggle/analytics/brands - Get brand analysis
router.get('/analytics/brands', kaggleAnalyticsController.getBrandAnalysis);

// GET /api/kaggle/analytics/compare - Compare all datasets
router.get('/analytics/compare', kaggleAnalyticsController.compareDatasets);

module.exports = router;
