const express = require('express');
const router = express.Router();

const {
    getProducts,
    getProductBySlug,
    createProduct,
    deleteProduct,
    getMyProducts,
    getFilterOptions,
    getRecommendations,
    getFeaturedCollections,
    getProductFiltersMeta,
    getSearchSuggestions,
    getNewArrivals
} = require('../controllers/productController');

const { protect, seller, admin } = require('../middleware/authMiddleware');

router.get('/collections/featured', getFeaturedCollections);
router.get('/filters/meta', getProductFiltersMeta);
router.get('/search/suggestions', getSearchSuggestions);
router.get('/new-arrivals', getNewArrivals);
router.route('/').get(getProducts).post(protect, seller, createProduct);
router.route('/filters').get(getFilterOptions);
router.route('/myproducts').get(protect, seller, getMyProducts);

router.route('/:id/recommendations').get(getRecommendations);
router.route('/:id').delete(protect, admin, deleteProduct);
router.route('/:slug').get(getProductBySlug);

module.exports = router;
