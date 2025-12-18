/**
 * Question & Answer Controller
 * Handles product Q&A section
 */

const QuestionAnswer = require('../models/QuestionAnswer');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get all Q&A for a product
// @route   GET /api/qa/product/:productId
// @access  Public
const getProductQuestions = async (req, res) => {
  try {
    const { productId } = req.params;
    const { sort = 'helpful', limit = 20, page = 1 } = req.query;

    let sortBy = {};
    switch (sort) {
      case 'newest':
        sortBy = { 'question.askedAt': -1 };
        break;
      case 'helpful':
        sortBy = { helpful: -1, 'question.askedAt': -1 };
        break;
      case 'unanswered':
        sortBy = { status: -1 };
        break;
      default:
        sortBy = { helpful: -1 };
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = Math.min(parseInt(limit) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    const questions = await QuestionAnswer.find({ product: productId })
      .populate('question.askedBy', 'name')
      .populate('answer.answeredBy', 'name storeName')
      .populate('communityAnswers.answeredBy', 'name')
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum);

    const total = await QuestionAnswer.countDocuments({ product: productId });

    res.json({
      data: questions,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Ask a question
// @route   POST /api/qa
// @access  Private
const askQuestion = async (req, res) => {
  try {
    const { productId, question } = req.body;

    if (!productId || !question || question.length < 10) {
      return res.status(400).json({ 
        message: 'Invalid question. Minimum 10 characters required.' 
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user purchased the product (for verified badge)
    const order = await Order.findOne({
      user: req.user._id,
      'items.product': productId
    });

    const qa = new QuestionAnswer({
      product: productId,
      question: {
        text: question,
        askedBy: req.user._id,
        verified: !!order
      }
    });

    await qa.save();
    await qa.populate('question.askedBy', 'name');

    res.status(201).json(qa);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Answer a question (seller/admin)
// @route   PUT /api/qa/:qaId/answer
// @access  Private (Seller/Admin)
const answerQuestion = async (req, res) => {
  try {
    const { qaId } = req.params;
    const { answer } = req.body;

    if (!answer || answer.length < 10) {
      return res.status(400).json({ 
        message: 'Invalid answer. Minimum 10 characters required.' 
      });
    }

    const qa = await QuestionAnswer.findByIdAndUpdate(
      qaId,
      {
        answer: {
          text: answer,
          answeredBy: req.user._id,
          answeredAt: new Date(),
          isOfficial: true
        },
        status: 'answered'
      },
      { new: true }
    )
      .populate('question.askedBy', 'name')
      .populate('answer.answeredBy', 'name storeName');

    if (!qa) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(qa);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add community answer
// @route   POST /api/qa/:qaId/community-answer
// @access  Private
const addCommunityAnswer = async (req, res) => {
  try {
    const { qaId } = req.params;
    const { answer } = req.body;

    if (!answer || answer.length < 10) {
      return res.status(400).json({ 
        message: 'Invalid answer. Minimum 10 characters required.' 
      });
    }

    // Check if user purchased the product
    const qa = await QuestionAnswer.findById(qaId).select('product');
    const order = await Order.findOne({
      user: req.user._id,
      'items.product': qa.product
    });

    const updatedQa = await QuestionAnswer.findByIdAndUpdate(
      qaId,
      {
        $push: {
          communityAnswers: {
            text: answer,
            answeredBy: req.user._id,
            verified: !!order
          }
        }
      },
      { new: true }
    )
      .populate('question.askedBy', 'name')
      .populate('communityAnswers.answeredBy', 'name');

    res.status(201).json(updatedQa);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark answer as helpful
// @route   POST /api/qa/:qaId/helpful
// @access  Private
const markHelpful = async (req, res) => {
  try {
    const { qaId } = req.params;
    const userId = req.user._id;

    const qa = await QuestionAnswer.findById(qaId);
    if (!qa) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if already voted
    const alreadyHelpful = qa.userHelpfulVotes.includes(userId);
    const alreadyNotHelpful = qa.userNotHelpfulVotes.includes(userId);

    if (alreadyHelpful) {
      // Remove helpful vote
      qa.helpful -= 1;
      qa.userHelpfulVotes = qa.userHelpfulVotes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Add helpful vote
      qa.helpful += 1;
      qa.userHelpfulVotes.push(userId);

      // Remove not helpful if exists
      if (alreadyNotHelpful) {
        qa.notHelpful -= 1;
        qa.userNotHelpfulVotes = qa.userNotHelpfulVotes.filter(
          (id) => id.toString() !== userId.toString()
        );
      }
    }

    await qa.save();
    res.json({ helpful: qa.helpful, notHelpful: qa.notHelpful });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark answer as not helpful
// @route   POST /api/qa/:qaId/not-helpful
// @access  Private
const markNotHelpful = async (req, res) => {
  try {
    const { qaId } = req.params;
    const userId = req.user._id;

    const qa = await QuestionAnswer.findById(qaId);
    if (!qa) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if already voted
    const alreadyHelpful = qa.userHelpfulVotes.includes(userId);
    const alreadyNotHelpful = qa.userNotHelpfulVotes.includes(userId);

    if (alreadyNotHelpful) {
      // Remove not helpful vote
      qa.notHelpful -= 1;
      qa.userNotHelpfulVotes = qa.userNotHelpfulVotes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Add not helpful vote
      qa.notHelpful += 1;
      qa.userNotHelpfulVotes.push(userId);

      // Remove helpful if exists
      if (alreadyHelpful) {
        qa.helpful -= 1;
        qa.userHelpfulVotes = qa.userHelpfulVotes.filter(
          (id) => id.toString() !== userId.toString()
        );
      }
    }

    await qa.save();
    res.json({ helpful: qa.helpful, notHelpful: qa.notHelpful });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete question/answer
// @route   DELETE /api/qa/:qaId
// @access  Private
const deleteQuestion = async (req, res) => {
  try {
    const { qaId } = req.params;
    const qa = await QuestionAnswer.findById(qaId);

    if (!qa) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user is the one who asked
    if (qa.question.askedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Not authorized to delete this question' 
      });
    }

    await QuestionAnswer.findByIdAndDelete(qaId);
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProductQuestions,
  askQuestion,
  answerQuestion,
  addCommunityAnswer,
  markHelpful,
  markNotHelpful,
  deleteQuestion
};
