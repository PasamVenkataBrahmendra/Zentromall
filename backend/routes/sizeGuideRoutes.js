const express = require('express');
const router = express.Router();
const {
    getProductSizeGuide,
    createSizeGuide,
    getCategorySizeGuide
} = require('../controllers/sizeGuideController');
const { protect, seller, admin } = require('../middleware/authMiddleware');

router.get('/product/:productId', getProductSizeGuide);
router.get('/category/:categoryId', getCategorySizeGuide);
router.post('/', protect, seller, createSizeGuide);

module.exports = router;

