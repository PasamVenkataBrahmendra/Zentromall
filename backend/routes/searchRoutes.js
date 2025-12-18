const express = require('express');
const router = express.Router();
const {
  searchProducts,
  getAutocompleteSuggestions,
  getSearchFilters,
  getTrendingSearches
} = require('../controllers/searchController');

// @route   GET /api/search
// @desc    Search products
// @access  Public
router.get('/', searchProducts);

// @route   GET /api/search/suggestions
// @desc    Get autocomplete suggestions
// @access  Public
router.get('/suggestions', getAutocompleteSuggestions);

// @route   GET /api/search/filters
// @desc    Get search filters
// @access  Public
router.get('/filters', getSearchFilters);

// @route   GET /api/search/trending
// @desc    Get trending searches
// @access  Public
router.get('/trending', getTrendingSearches);

module.exports = router;
