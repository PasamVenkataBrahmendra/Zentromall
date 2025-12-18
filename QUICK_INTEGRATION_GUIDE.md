# 🚀 Quick Integration Guide - Phase 1 Features

## Step 1: Backend Server Setup (5 minutes)

Edit `backend/server.js` and add these routes:

```javascript
// Add near the top with other imports
const searchRoutes = require('./routes/searchRoutes');
const qaRoutes = require('./routes/qaRoutes');

// Add near the bottom with other app.use() calls
app.use('/api/search', searchRoutes);
app.use('/api/qa', qaRoutes);

// Note: Make sure /api/cart route is using updated cartController
// with new methods: applyCoupon, calculateTotal, getShippingMethods
```

## Step 2: Test Backend Endpoints (10 minutes)

### Test Search with Autocomplete
```bash
# Get autocomplete suggestions
curl "http://localhost:5000/api/search/suggestions?q=phone&type=all"

# Search products
curl "http://localhost:5000/api/search?q=phone&sort=newest&limit=10"

# Get search filters
curl "http://localhost:5000/api/search/filters?q=phone"
```

### Test Q&A
```bash
# Get product Q&A
curl "http://localhost:5000/api/qa/product/<PRODUCT_ID>"

# Ask question (requires auth token)
curl -X POST http://localhost:5000/api/qa \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"productId":"<ID>","question":"Is this product good?"}'
```

### Test Cart Pricing
```bash
# Get cart with pricing
curl "http://localhost:5000/api/cart" \
  -H "Authorization: Bearer <TOKEN>"

# Calculate total with coupon
curl -X POST http://localhost:5000/api/cart/calculate \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"couponCode":"SAVE10","zipCode":"400001"}'
```

## Step 3: Frontend Component Integration (10 minutes)

### 1. Update Layout with Comparison Provider

File: `frontend/app/layout.js`

```javascript
'use client';

import { ComparisonProvider } from '@/context/ComparisonContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ComparisonProvider>
          {children}
        </ComparisonProvider>
      </body>
    </html>
  );
}
```

### 2. Add SearchBar to Navbar

File: `frontend/src/components/Navbar.js`

```javascript
import SearchBar from './SearchBar';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Zentromall</div>
      
      <SearchBar />
      
      <div className={styles.icons}>
        {/* other nav items */}
      </div>
    </nav>
  );
}
```

### 3. Add to Product Detail Page

File: `frontend/app/product/[slug]/page.js`

```javascript
import ProductQA from '@/components/ProductQA';
import PriceBreakdown from '@/components/PriceBreakdown';

export default function ProductPage({ params }) {
  const { slug } = params;
  
  // Fetch product data...
  const product = await fetchProduct(slug);
  
  // Calculate pricing
  const subtotal = product.price;
  const tax = subtotal * 0.18;
  const shipping = subtotal > 500 ? 0 : 40;
  const total = subtotal + tax + shipping;

  return (
    <div>
      {/* Product images and details */}
      
      {/* Price breakdown */}
      <PriceBreakdown 
        subtotal={subtotal}
        discount={0}
        tax={tax}
        shipping={shipping}
        showDetails={true}
      />
      
      {/* Q&A section */}
      <ProductQA 
        productId={product._id}
        productTitle={product.title}
      />
    </div>
  );
}
```

### 4. Create Comparison Page

Create file: `frontend/app/compare/page.js`

```javascript
'use client';

import ProductComparison from '@/components/ProductComparison';

export default function ComparePage() {
  return (
    <main>
      <h1>Compare Products</h1>
      <ProductComparison />
    </main>
  );
}
```

### 5. Add Compare Button to Product Card

File: `frontend/src/components/ProductCard.js`

```javascript
import { useComparison } from '@/context/ComparisonContext';

export default function ProductCard({ product }) {
  const { addToComparison, isInComparison, removeFromComparison } = useComparison();

  const handleCompare = () => {
    if (isInComparison(product._id)) {
      removeFromComparison(product._id);
    } else {
      addToComparison(product);
    }
  };

  return (
    <div className={styles.card}>
      <img src={product.images[0]} alt={product.title} />
      <h3>{product.title}</h3>
      <p className={styles.price}>₹{product.price}</p>
      
      <button onClick={handleCompare}>
        {isInComparison(product._id) ? '✓ In Comparison' : '+ Compare'}
      </button>
    </div>
  );
}
```

## Step 4: Test Frontend Components (10 minutes)

1. **Test SearchBar**
   - Type in search box
   - Check autocomplete appears
   - Try keyboard navigation (arrow keys)
   - Click suggestion and verify navigation

2. **Test Product Comparison**
   - Add 3-4 products to comparison
   - View comparison page
   - Check desktop and mobile views
   - Remove items

3. **Test Q&A Section**
   - View existing questions
   - Ask new question (requires login)
   - Try sorting options
   - Add community answer

4. **Test Price Breakdown**
   - Add items to cart
   - Check pricing calculation
   - Apply coupon code
   - Verify tax and shipping

## Step 5: Environment Variables

Update `.env` or `.env.local` if needed:

```env
# Backend
MONGODB_URI=mongodb://...
JWT_SECRET=your_secret

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Step 6: Run Tests (5 minutes)

```bash
# Backend tests
cd backend
npm test

# Frontend tests (if configured)
cd frontend
npm test
```

## Troubleshooting

### Search not working?
- Check Product model has title and description fields
- Ensure MongoDB connection is working
- Check console for errors

### Q&A showing errors?
- Verify User and Product models exist
- Check authentication middleware
- Ensure Order model is imported

### Price breakdown not calculating?
- Check orderCalculator imports
- Verify product has price field
- Check tax rate (default 18%)

### Comparison not showing products?
- Check ComparisonProvider wraps layout
- Verify product structure matches
- Check mobile CSS is loading

---

## Quick Checklist

- [ ] Backend routes added to server.js
- [ ] Test search endpoint works
- [ ] Test Q&A endpoint works
- [ ] Test cart pricing endpoint works
- [ ] ComparisonProvider added to layout
- [ ] SearchBar added to Navbar
- [ ] Q&A added to product page
- [ ] Price breakdown added to product page
- [ ] Comparison page created
- [ ] All components load without errors
- [ ] Mobile responsive working
- [ ] API calls returning correct data

---

## Expected Results

After integration, you should have:

✅ **Search**: Real-time autocomplete with grouping  
✅ **Q&A**: Questions, answers, voting system  
✅ **Comparison**: Side-by-side product comparison  
✅ **Pricing**: Detailed price breakdown with tax/shipping  
✅ **Cart**: Enhanced pricing calculations with coupon support  

---

## Next Steps

1. Deploy and test in staging environment
2. Get user feedback
3. Fix any bugs
4. Proceed to Phase 2:
   - Multi-step checkout flow
   - Payment integration (Razorpay/Stripe)
   - Email notifications

---

**Time to Complete**: ~30 minutes  
**Difficulty Level**: Beginner-Intermediate  
**No Breaking Changes**: ✅ Safe to deploy with existing code
