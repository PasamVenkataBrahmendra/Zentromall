# Testing & Quality Checks

## Automated Tests
We use **Jest** and **Supertest** for backend API testing.

### Running Tests
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Run the test script:
   ```bash
   npm test
   ```

## Manual Testing Checklist

### Authentication
- [ ] **Register**: Create a new account with valid details.
- [ ] **Login**: Log in with the new account.
- [ ] **Logout**: Verify session is cleared.
- [ ] **Profile**: Check if user details are displayed correctly.

### Shopping Experience
- [ ] **Home Page**: Verify banner and featured products load.
- [ ] **Shop Page**: Scroll through products, check images and prices.
- [ ] **Product Details**: Click a product, verify description and "Add to Cart" button.
- [ ] **Cart**: Add items, check total calculation, remove items.

### Shop with AI
- [ ] **Wizard**: Complete the questionnaire (Category, Budget, etc.).
- [ ] **Results**: Verify recommendations appear and make sense.

### Admin Panel
- [ ] **Access**: Try accessing `/admin` as a normal user (should fail/redirect).
- [ ] **Dashboard**: Log in as Admin, check stats.
- [ ] **Products**: Add a new product, delete a product.
- [ ] **Orders**: View all orders, mark an order as "Delivered".

### Seller Panel
- [ ] **Access**: Log in as Seller, check dashboard.
- [ ] **My Products**: Verify only your products are listed.
- [ ] **Add Product**: Create a product, verify it's assigned to you.
- [ ] **Seller Orders**: Place an order for a seller's item (as another user), verify it appears here.
