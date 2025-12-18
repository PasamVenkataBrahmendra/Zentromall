const express = require('express');
const router = express.Router();
const {
  getProductQuestions,
  askQuestion,
  answerQuestion,
  addCommunityAnswer,
  markHelpful,
  markNotHelpful,
  deleteQuestion
} = require('../controllers/qaController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/qa/product/:productId
// @desc    Get Q&A for product
// @access  Public
router.get('/product/:productId', getProductQuestions);

// @route   POST /api/qa
// @desc    Ask a question
// @access  Private
router.post('/', protect, askQuestion);

// @route   PUT /api/qa/:qaId/answer
// @desc    Answer a question (seller/admin)
// @access  Private
router.put('/:qaId/answer', protect, answerQuestion);

// @route   POST /api/qa/:qaId/community-answer
// @desc    Add community answer
// @access  Private
router.post('/:qaId/community-answer', protect, addCommunityAnswer);

// @route   POST /api/qa/:qaId/helpful
// @desc    Mark as helpful
// @access  Private
router.post('/:qaId/helpful', protect, markHelpful);

// @route   POST /api/qa/:qaId/not-helpful
// @desc    Mark as not helpful
// @access  Private
router.post('/:qaId/not-helpful', protect, markNotHelpful);

// @route   DELETE /api/qa/:qaId
// @desc    Delete question
// @access  Private
router.delete('/:qaId', protect, deleteQuestion);

module.exports = router;
