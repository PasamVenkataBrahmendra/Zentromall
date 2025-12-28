const express = require('express');
const router = express.Router();
const { createPreOrder, getMyPreOrders } = require('../controllers/preOrderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createPreOrder);
router.get('/', protect, getMyPreOrders);

module.exports = router;

