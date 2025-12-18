/**
 * Kaggle Data Management Utility
 * Helper functions for managing and analyzing Kaggle datasets
 */

const Product = require('./models/Product');
const Review = require('./models/Review');

class KaggleDataManager {
    /**
     * Get statistics about Kaggle datasets
     */
    static async getDatasetStats() {
        try {
            const sources = ['kaggle-olist', 'kaggle-amazon', 'kaggle-fashion', 'kaggle-books'];
            const stats = {};

            for (const source of sources) {
                const products = await Product.countDocuments({ source });
                const reviews = await Review.countDocuments();
                
                const avgRating = await Product.aggregate([
                    { $match: { source } },
                    { $group: { _id: null, avgRating: { $avg: '$rating' } } }
                ]);

                stats[source] = {
                    products,
                    avgRating: avgRating[0]?.avgRating?.toFixed(2) || 0,
                    totalReviews: reviews
                };
            }

            return stats;
        } catch (error) {
            console.error('Error getting dataset stats:', error);
            throw error;
        }
    }

    /**
     * Get products from specific Kaggle source
     */
    static async getProductsBySource(source, limit = 10, skip = 0) {
        try {
            return await Product.find({ source })
                .limit(limit)
                .skip(skip)
                .sort({ rating: -1 });
        } catch (error) {
            console.error('Error fetching products by source:', error);
            throw error;
        }
    }

    /**
     * Get high-rated products from Kaggle datasets
     */
    static async getTopRatedProducts(minRating = 4.5, limit = 20) {
        try {
            return await Product.find({
                source: { $regex: /kaggle-/ },
                rating: { $gte: minRating }
            })
            .limit(limit)
            .sort({ rating: -1, numReviews: -1 });
        } catch (error) {
            console.error('Error fetching top-rated products:', error);
            throw error;
        }
    }

    /**
     * Get review analysis for Kaggle products
     */
    static async getReviewAnalysis(source) {
        try {
            const products = await Product.find({ source });
            const productIds = products.map(p => p._id);

            const reviews = await Review.find({ product: { $in: productIds } });

            const analysis = {
                totalReviews: reviews.length,
                averageRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2),
                ratingDistribution: {
                    five: reviews.filter(r => r.rating === 5).length,
                    four: reviews.filter(r => r.rating === 4).length,
                    three: reviews.filter(r => r.rating === 3).length,
                    two: reviews.filter(r => r.rating === 2).length,
                    one: reviews.filter(r => r.rating === 1).length
                }
            };

            return analysis;
        } catch (error) {
            console.error('Error getting review analysis:', error);
            throw error;
        }
    }

    /**
     * Compare Kaggle datasets
     */
    static async compareDatasets() {
        try {
            const stats = await this.getDatasetStats();
            
            const comparison = {
                bestByRating: Object.entries(stats)
                    .sort((a, b) => b[1].avgRating - a[1].avgRating)
                    .slice(0, 1),
                mostReviewed: Object.entries(stats)
                    .sort((a, b) => b[1].products - a[1].products)
                    .slice(0, 1),
                fullStats: stats
            };

            return comparison;
        } catch (error) {
            console.error('Error comparing datasets:', error);
            throw error;
        }
    }

    /**
     * Get trending products from Kaggle data
     */
    static async getTrendingProducts(days = 30, limit = 20) {
        try {
            const dateThreshold = new Date();
            dateThreshold.setDate(dateThreshold.getDate() - days);

            return await Product.find({
                source: { $regex: /kaggle-/ },
                createdAt: { $gte: dateThreshold },
                numReviews: { $gte: 10 }
            })
            .limit(limit)
            .sort({ numReviews: -1, rating: -1 });
        } catch (error) {
            console.error('Error fetching trending products:', error);
            throw error;
        }
    }

    /**
     * Get category-wise product count from Kaggle data
     */
    static async getCategoryAnalysis() {
        try {
            return await Product.aggregate([
                { $match: { source: { $regex: /kaggle-/ } } },
                { $group: {
                    _id: '$category',
                    productCount: { $sum: 1 },
                    avgRating: { $avg: '$rating' },
                    totalReviews: { $sum: '$numReviews' }
                }},
                { $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }},
                { $sort: { productCount: -1 } }
            ]);
        } catch (error) {
            console.error('Error getting category analysis:', error);
            throw error;
        }
    }

    /**
     * Export Kaggle data to CSV (useful for analysis)
     */
    static async exportToCSV(source, filepath) {
        try {
            const products = await Product.find({ source });
            const csv = this._convertToCSV(products);
            
            const fs = require('fs');
            fs.writeFileSync(filepath, csv);
            
            return { success: true, file: filepath, count: products.length };
        } catch (error) {
            console.error('Error exporting to CSV:', error);
            throw error;
        }
    }

    /**
     * Helper function to convert data to CSV
     */
    static _convertToCSV(data) {
        if (!data || data.length === 0) return '';

        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(item => 
            Object.values(item).map(val => 
                typeof val === 'string' ? `"${val}"` : val
            ).join(',')
        );

        return [headers, ...rows].join('\n');
    }

    /**
     * Find similar products (for recommendations)
     */
    static async findSimilarProducts(productId, limit = 5) {
        try {
            const product = await Product.findById(productId);
            if (!product) throw new Error('Product not found');

            return await Product.find({
                category: product.category,
                source: { $regex: /kaggle-/ },
                _id: { $ne: productId }
            })
            .limit(limit)
            .sort({ rating: -1 });
        } catch (error) {
            console.error('Error finding similar products:', error);
            throw error;
        }
    }

    /**
     * Get products by price range from Kaggle data
     */
    static async getProductsByPrice(minPrice, maxPrice, limit = 20) {
        try {
            return await Product.find({
                source: { $regex: /kaggle-/ },
                price: { $gte: minPrice, $lte: maxPrice }
            })
            .limit(limit)
            .sort({ rating: -1 });
        } catch (error) {
            console.error('Error fetching products by price:', error);
            throw error;
        }
    }

    /**
     * Get brand analysis from Kaggle data
     */
    static async getBrandAnalysis() {
        try {
            return await Product.aggregate([
                { $match: { source: { $regex: /kaggle-/ } } },
                { $group: {
                    _id: '$brand',
                    productCount: { $sum: 1 },
                    avgPrice: { $avg: '$price' },
                    avgRating: { $avg: '$rating' },
                    totalReviews: { $sum: '$numReviews' }
                }},
                { $sort: { productCount: -1 } },
                { $limit: 20 }
            ]);
        } catch (error) {
            console.error('Error getting brand analysis:', error);
            throw error;
        }
    }

    /**
     * Sync Kaggle data with external source (for updates)
     */
    static async syncWithExternalSource() {
        try {
            console.log('🔄 Syncing Kaggle data...');
            // This would connect to actual Kaggle API
            // For now, it's a placeholder for future enhancement
            return { status: 'ready', message: 'Sync functionality ready for implementation' };
        } catch (error) {
            console.error('Error syncing data:', error);
            throw error;
        }
    }
}

module.exports = KaggleDataManager;
