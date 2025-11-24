const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    points: { type: Number, default: 0 },
    history: [{
        type: { type: String, enum: ['earned', 'redeemed'], required: true },
        points: { type: Number, required: true },
        description: { type: String },
        date: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Reward', rewardSchema);
