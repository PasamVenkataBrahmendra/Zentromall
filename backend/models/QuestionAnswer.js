const mongoose = require('mongoose');

const questionAnswerSchema = new mongoose.Schema({
  // Reference
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true,
    index: true
  },

  // Question details
  question: {
    text: { type: String, required: true },
    askedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    askedAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false } // Verified purchase
  },

  // Answer details (seller response)
  answer: {
    text: String,
    answeredBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Seller' 
    },
    answeredAt: Date,
    isOfficial: { type: Boolean, default: false } // Seller official answer
  },

  // Community responses
  communityAnswers: [{
    text: { type: String, required: true },
    answeredBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    answeredAt: { type: Date, default: Date.now },
    helpful: { type: Number, default: 0 },
    notHelpful: { type: Number, default: 0 },
    verified: { type: Boolean, default: false }
  }],

  // Metadata
  helpful: { type: Number, default: 0 }, // Count of helpful votes
  notHelpful: { type: Number, default: 0 },
  userHelpfulVotes: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }
  ],
  userNotHelpfulVotes: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }
  ],

  // Status
  status: { 
    type: String, 
    enum: ['unanswered', 'answered', 'closed'], 
    default: 'unanswered' 
  },
  pinned: { type: Boolean, default: false } // Important questions

}, { timestamps: true });

// Index for efficient querying
questionAnswerSchema.index({ product: 1, status: 1 });
questionAnswerSchema.index({ 'question.askedBy': 1 });
questionAnswerSchema.index({ helpful: -1 }); // Most helpful first

module.exports = mongoose.model('QuestionAnswer', questionAnswerSchema);
