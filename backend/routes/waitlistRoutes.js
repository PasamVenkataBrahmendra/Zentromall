const express = require('express');
const router = express.Router();
const {
    joinWaitlist,
    getMyWaitlist,
    leaveWaitlist
} = require('../controllers/waitlistController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', joinWaitlist);
router.get('/', protect, getMyWaitlist);
router.delete('/:id', protect, leaveWaitlist);

module.exports = router;

