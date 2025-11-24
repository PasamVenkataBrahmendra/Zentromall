# ZentroMall API Reference

## Authentication
### Register User
- **URL**: `/api/users/register`
- **Method**: `POST`
- **Body**: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`
- **Response**: `{ "_id": "...", "name": "...", "token": "..." }`

### Login User
- **URL**: `/api/users/login`
- **Method**: `POST`
- **Body**: `{ "email": "john@example.com", "password": "password123" }`
- **Response**: `{ "_id": "...", "token": "..." }`

### Get Profile
- **URL**: `/api/users/profile`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`

## Products
### Get All Products
- **URL**: `/api/products`
- **Method**: `GET`
- **Query Params**: `?keyword=iphone`

### Get Single Product
- **URL**: `/api/products/:slug`
- **Method**: `GET`

### Create Product (Admin/Seller)
- **URL**: `/api/products`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "title": "...", "price": 100, ... }`

## Categories
### Get All Categories
- **URL**: `/api/categories`
- **Method**: `GET`

### Create Category (Admin)
- **URL**: `/api/categories`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`

## Cart
### Get Cart
- **URL**: `/api/cart`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`

### Add to Cart
- **URL**: `/api/cart`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "productId": "...", "quantity": 1 }`

## Orders
### Create Order
- **URL**: `/api/orders`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "shippingAddress": { ... }, "paymentMethod": "card" }`

### Get My Orders
- **URL**: `/api/orders/myorders`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`

## Shop with AI
### Get Questions
- **URL**: `/api/ai-shop/questions`
- **Method**: `GET`

### Recommend Products
- **URL**: `/api/ai-shop/recommend`
- **Method**: `POST`
- **Body**: `{ "category": "Electronics", "budget": 1000, "usage": ["Gaming"], "brand": ["Sony"], "rating": 4 }`
- **Response**: `{ "topPicks": [...], "otherMatches": [...] }`
