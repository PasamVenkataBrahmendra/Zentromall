const Product = require('../models/Product');
const AIShopAnswers = require('../models/AIShopAnswers');

// @desc    Get AI Shop Questions
// @route   GET /api/ai-shop/questions
// @access  Public
const getQuestions = (req, res) => {
    const questions = [
        {
            id: 'category',
            text: 'What are you looking for?',
            type: 'select',
            options: ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports']
        },
        {
            id: 'budget',
            text: 'What is your budget?',
            type: 'range',
            min: 0,
            max: 10000
        },
        {
            id: 'usage',
            text: 'What will you use this for?',
            type: 'multi-select',
            options: ['Gaming', 'Office', 'Casual', 'Professional', 'Outdoor']
        },
        {
            id: 'brand',
            text: 'Any preferred brands?',
            type: 'multi-select',
            options: ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony']
        },
        {
            id: 'rating',
            text: 'Minimum Rating',
            type: 'rating',
            min: 1,
            max: 5
        }
    ];
    res.json(questions);
};

// @desc    Get Recommendations
// @route   POST /api/ai-shop/recommend
// @access  Public
const recommendProducts = async (req, res) => {
    const { category, budget, usage, brand, rating } = req.body;

    try {
        // 1. Basic Filtering
        let query = {};
        if (category) {
            // Assuming we join with Category model or store category name directly. 
            // For simplicity, let's assume we filter by category ID if provided, or we need to lookup category.
            // To keep it simple for this mission, we'll skip strict category ID check and assume frontend sends valid ID or we filter if possible.
            // If category is a string name, we might need to find the ID first. 
            // Let's assume frontend sends a Category ID for now, or we filter in memory if dataset is small (not ideal for prod).
            // Better: Frontend sends Category ID.
        }

        if (budget) {
            query.price = { $lte: budget };
        }

        if (rating) {
            query.rating = { $gte: rating };
        }

        // Fetch candidates
        let products = await Product.find(query).populate('category');

        // 2. Scoring Algorithm
        const scoredProducts = products.map(product => {
            let score = 0;
            let reasons = [];

            // Category Match (if name passed)
            if (category && product.category.name === category) {
                score += 50;
                reasons.push('Matches your category');
            }

            // Budget Match (closer to budget is better? or just under? Let's say under is good)
            if (budget && product.price <= budget) {
                score += 20;
                reasons.push('Within your budget');
            }

            // Rating Boost
            if (product.rating) {
                score += product.rating * 5; // Max 25 points
                if (product.rating >= 4.5) reasons.push('Highly rated');
            }

            // Brand Match (Check title or description or tags)
            if (brand && brand.length > 0) {
                const brandMatch = brand.some(b => product.title.toLowerCase().includes(b.toLowerCase()));
                if (brandMatch) {
                    score += 30;
                    reasons.push('From your preferred brand');
                }
            }

            // Usage Match (Check tags)
            if (usage && usage.length > 0 && product.tags) {
                const usageMatch = usage.some(u => product.tags.includes(u));
                if (usageMatch) {
                    score += 40;
                    reasons.push('Perfect for your usage');
                }
            }

            return {
                ...product.toObject(),
                score,
                recommendationReason: reasons.join(', ') || 'Recommended for you'
            };
        });

        // 3. Sort and Select
        scoredProducts.sort((a, b) => b.score - a.score);

        const topPicks = scoredProducts.slice(0, 3);
        const otherMatches = scoredProducts.slice(3, 10);

        // 4. Save Answers (if user is logged in, or just anonymous)
        // For now, just save if we have a user ID, or skip.
        if (req.user) {
            await AIShopAnswers.create({
                user: req.user._id,
                answers: req.body,
                generatedRecommendations: topPicks.map(p => p._id)
            });
        }

        res.json({
            topPicks,
            otherMatches
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getQuestions, recommendProducts };
