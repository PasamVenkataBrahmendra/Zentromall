const mongoose = require('mongoose');

const aiShopAnswersSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional for guest users
    answers: { type: Map, of: mongoose.Schema.Types.Mixed, required: true }, // Allow numbers/arrays
    generatedRecommendations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

module.exports = mongoose.model('AIShopAnswers', aiShopAnswersSchema);
