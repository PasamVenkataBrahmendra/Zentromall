const express = require('express');
const router = express.Router();
const { getProducts, getProductBySlug, createProduct, deleteProduct, getMyProducts, getFilterOptions, getRecommendations } = require('../controllers/productController');
const { protect, seller, admin } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, seller, createProduct);
router.route('/filters').get(getFilterOptions);
router.route('/myproducts').get(protect, seller, getMyProducts);
router.route('/:slug').get(getProductBySlug);
router.route('/:id/recommendations').get(getRecommendations);
router.route('/:id').delete(protect, admin, deleteProduct);

module.exports = router;
