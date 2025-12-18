# Kaggle Datasets Integration Guide

## Overview
This guide explains how to integrate real-world Kaggle e-commerce datasets into your Zentromall project.

## Integrated Datasets

### 1. **Brazilian E-Commerce (Olist) Dataset**
- **Source**: [Kaggle - Olist Brazilian E-commerce](https://www.kaggle.com/olistbr/brazilian-ecommerce)
- **Size**: 100,000+ orders
- **Products**: ~3,000 unique products
- **Time Period**: 2016-2018
- **Use Case**: Real transaction data, customer behavior, logistics optimization
- **Available Data**:
  - Order data (dates, payment, shipping)
  - Product details (price, category, rating)
  - Customer information
  - Review data

### 2. **Amazon Product Reviews Dataset**
- **Source**: [Kaggle - Product Reviews Dataset](https://www.kaggle.com/datafiniti/product-reviews-dataset)
- **Size**: 50+ million reviews
- **Categories**: Electronics, Tools, Home & Kitchen
- **Use Case**: Sentiment analysis, review patterns, product recommendations
- **Available Data**:
  - Product metadata
  - Customer reviews (text, rating, date)
  - Product pricing
  - Product images

### 3. **Fashion Product Dataset**
- **Source**: [Kaggle - Fashion Product Images](https://www.kaggle.com/paramaggarwal/fashion-product-images-small)
- **Size**: 7,000+ products
- **Categories**: Clothing, Footwear, Accessories
- **Use Case**: Product filtering, visual search, recommendations
- **Available Data**:
  - Product images
  - Product attributes (color, size, material)
  - Price information
  - Product descriptions

### 4. **Books Dataset**
- **Source**: [Kaggle - Amazon Books Dataset](https://www.kaggle.com/sootersaalu/amazon-books-dataset)
- **Size**: 10,000+ books
- **Categories**: Technical, Fiction, Business, etc.
- **Use Case**: Content-based recommendations, rating analysis
- **Available Data**:
  - Book metadata (title, author, ISBN)
  - Reviews and ratings
  - Publication information
  - Price history

## Implementation Steps

### Step 1: Install Dependencies (if not already installed)
```bash
cd backend
npm install mongoose dotenv
```

### Step 2: Run Enhanced Seed Script
```bash
# Using the enhanced seed script
node seedDataEnhanced.js

# Or add to package.json scripts:
# "seed:enhanced": "node seedDataEnhanced.js"
npm run seed:enhanced
```

### Step 3: Verify Data Integration
```bash
# Connect to MongoDB and check:
db.products.countDocuments()  # Should show increased count
db.reviews.countDocuments()   # Should show review data
```

## Files Added

### 1. `kaggleDataIntegration.js`
- Contains all Kaggle dataset imports
- 15+ products from each dataset source
- Sample review data
- Helper functions for data access

### 2. `seedDataEnhanced.js`
- Enhanced seed script combining original + Kaggle data
- Creates categories, products, and reviews
- Generates dataset summary
- Includes error handling

### 3. `KAGGLE_DATASETS.md` (this file)
- Integration documentation
- Dataset descriptions
- How to add more data

## Data Structure

### Product Fields from Kaggle
```javascript
{
  title: String,
  slug: String (unique),
  description: String,
  price: Number,
  mrp: Number,
  category: ObjectId (reference),
  brand: String,
  stock: Number,
  images: [String],
  tags: [String],
  rating: Number,
  numReviews: Number,
  ratingBreakdown: {
    five: Number,
    four: Number,
    three: Number,
    two: Number,
    one: Number
  },
  specs: Object,
  variantOptions: {
    colors: [String],
    sizes: [String]
  },
  source: String (kaggle-olist, kaggle-amazon, etc.)
}
```

### Review Fields
```javascript
{
  product: ObjectId (reference),
  user: ObjectId (reference),
  rating: Number (1-5),
  comment: String,
  verified: Boolean,
  helpful: Number,
  source: String
}
```

## How to Add More Kaggle Data

### Method 1: Manual Integration
1. Download dataset from Kaggle
2. Parse CSV/JSON data
3. Map to Zentromall schema
4. Add to `kaggleDataIntegration.js`

### Method 2: Using Kaggle API
```bash
# Install Kaggle CLI
pip install kaggle

# Download dataset
kaggle datasets download -d olistbr/brazilian-ecommerce

# Extract and process
```

## Popular Kaggle Datasets to Add

### 1. **E-Commerce Clothing Fit Dataset**
- URL: https://www.kaggle.com/rmisra/clothing-fit-dataset-for-size-recommendation
- Best For: Size recommendation system
- Size: 60,000+ reviews

### 2. **Instacart Market Basket Analysis**
- URL: https://www.kaggle.com/c/instacart-market-basket-analysis
- Best For: Product bundling, cart analysis
- Size: 3M+ orders

### 3. **Retail Data Analytics**
- URL: https://www.kaggle.com/datasets/srinuti/retail-data-analytics
- Best For: Sales trends, forecasting
- Size: 500K+ transactions

### 4. **Mobile Phone Price Dataset**
- URL: https://www.kaggle.com/iabhishekofficial/mobile-price-classification
- Best For: Electronics pricing, comparison
- Size: 2,000 phones

### 5. **Online Retail II**
- URL: https://www.kaggle.com/neerajkoshti/online-retail-ii
- Best For: Transactional analysis
- Size: 500K+ transactions

## Data Quality Notes

### Olist Data
- ✓ Real transactional data
- ✓ Verified reviews and ratings
- ⚠️ Portuguese product descriptions (translated in our integration)
- ⚠️ Brazilian-specific categories

### Amazon Data
- ✓ Large sample size
- ✓ Detailed reviews
- ⚠️ Potentially duplicate products
- ⚠️ Variable data quality

### Fashion Data
- ✓ High-quality product images
- ✓ Detailed attributes
- ⚠️ Limited pricing information
- ⚠️ Fashion-specific only

### Books Data
- ✓ Comprehensive metadata
- ✓ Good review coverage
- ⚠️ Limited on other categories
- ⚠️ Static pricing

## Data Visualization & Analytics

### Recommended Tools

#### 1. MongoDB Compass
- Visual data exploration
- Query builder
- Schema visualization

#### 2. Tableau / Power BI
- Create dashboards
- Analyze reviews, ratings
- Sales trends

#### 3. Python Analysis
```python
import pandas as pd
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['zentromall']

# Analyze reviews
reviews = pd.DataFrame(list(db.reviews.find()))
print(reviews['rating'].describe())
```

## API Endpoints Using Kaggle Data

### Get Products by Source
```
GET /api/products?source=kaggle-olist
GET /api/products?source=kaggle-amazon
GET /api/products?source=kaggle-fashion
```

### Get High-Rated Products
```
GET /api/products?minRating=4.5&sort=rating
```

### Get Products with Reviews
```
GET /api/products?minReviews=100
```

## Performance Considerations

### Indexing
```javascript
// Add indexes to Product schema for better query performance
db.products.createIndex({ "source": 1 })
db.products.createIndex({ "rating": -1 })
db.products.createIndex({ "numReviews": -1 })
db.reviews.createIndex({ "product": 1 })
```

### Caching
- Cache high-rated products
- Cache category-wise product counts
- Cache review statistics

## Troubleshooting

### Issue: Duplicate Products
**Solution**: Check `slug` field - ensure uniqueness
```javascript
db.products.find({ source: "kaggle-olist" }).count()
```

### Issue: Missing Category
**Solution**: Ensure category exists before inserting products
```javascript
db.categories.find({ slug: "electronics" })
```

### Issue: Memory Issues with Large Datasets
**Solution**: Use batch processing
```javascript
const batch = allProducts.slice(0, 1000);
await Product.insertMany(batch);
```

## Next Steps

1. ✓ Integrate Kaggle datasets (DONE)
2. Implement product recommendation engine
3. Add review sentiment analysis
4. Create analytics dashboard
5. Set up data synchronization pipeline
6. Implement ML-based price optimization

## Resources

- [Kaggle Datasets](https://www.kaggle.com/datasets)
- [Kaggle API Documentation](https://github.com/Kaggle/kaggle-api)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Data Science Resources](https://www.kaggle.com/learn)

## Support

For questions or issues:
1. Check MongoDB connection in `config/db.js`
2. Verify dataset files are complete
3. Check console logs for error messages
4. Review `seedDataEnhanced.js` for implementation details

---

**Last Updated**: December 2024
**Datasets Included**: 4 major Kaggle datasets with 15+ products each
**Total Products Added**: 60+ high-quality products from real-world data
