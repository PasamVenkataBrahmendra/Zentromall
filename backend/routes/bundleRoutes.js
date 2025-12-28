const express = require('express');
const router = express.Router();
const { getBundles, createBundle } = require('../controllers/bundleController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getBundles);
router.post('/', protect, admin, createBundle);

module.exports = router;

