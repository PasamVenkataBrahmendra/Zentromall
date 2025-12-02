const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductBySlug,
    getFeaturedCollections,
    getProductFiltersMeta,
    getSearchSuggestions,
    createProduct,
    deleteProduct,
    getMyProducts
} = require('../controllers/productController');
const { protect, seller, admin } = require('../middleware/authMiddleware');

router.get('/collections/featured', getFeaturedCollections);
router.get('/filters/meta', getProductFiltersMeta);
router.get('/search/suggestions', getSearchSuggestions);
router.route('/').get(getProducts).post(protect, seller, createProduct);
router.route('/myproducts').get(protect, seller, getMyProducts);
router.route('/:id').delete(protect, admin, deleteProduct);
router.route('/:slug').get(getProductBySlug);

module.exports = router;
