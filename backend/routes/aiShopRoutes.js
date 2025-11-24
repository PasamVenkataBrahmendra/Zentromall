const express = require('express');
const router = express.Router();
const { getQuestions, recommendProducts } = require('../controllers/aiShopController');
const { protect } = require('../middleware/authMiddleware');

// Optional: protect recommend endpoint if we want to save history for logged in users
// For now, let's make it public but check for user in controller if token exists (middleware can be optional)

router.get('/questions', getQuestions);
router.post('/recommend', recommendProducts);

module.exports = router;
