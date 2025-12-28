const express = require('express');
const router = express.Router();
const { followSeller, unfollowSeller, getFollowedSellers } = require('../controllers/followController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, followSeller);
router.delete('/:sellerId', protect, unfollowSeller);
router.get('/', protect, getFollowedSellers);

module.exports = router;

