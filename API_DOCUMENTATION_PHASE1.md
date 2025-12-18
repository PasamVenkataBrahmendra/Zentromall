# 📚 API Documentation - Phase 1 Features

## Table of Contents
1. [Search API](#search-api)
2. [Q&A API](#qa-api)
3. [Cart Pricing API](#cart-pricing-api)

---

## Search API

### Get Search Suggestions (Autocomplete)

```
GET /api/search/suggestions
```

**Query Parameters:**
- `q` (string, required): Search query (minimum 2 characters)
- `type` (string, optional): 'products', 'categories', 'brands', or 'all' (default: 'all')

**Example Request:**
```bash
GET /api/search/suggestions?q=phone&type=all
```

**Example Response:**
```json
{
  "suggestions": [
    {
      "id": "507f1f77bcf86cd799439011",
      "type": "product",
      "title": "iPhone 14 Pro",
      "slug": "iphone-14-pro",
      "image": "https://...",
      "price": 99999,
      "icon": "📦"
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "type": "category",
      "title": "Smartphones",
      "slug": "smartphones",
      "image": "https://...",
      "icon": "📂"
    },
    {
      "id": "apple",
      "type": "brand",
      "title": "Apple",
      "count": 45,
      "icon": "🏷️"
    },
    {
      "type": "search",
      "title": "phone",
      "count": 234,
      "icon": "🔍"
    }
  ]
}
```

**Status Codes:**
- `200`: Success
- `500`: Server error

---

### Search Products

```
GET /api/search
```

**Query Parameters:**
- `q` (string, optional): Search query
- `category` (string, optional): Category ID
- `minPrice` (number, optional): Minimum price
- `maxPrice` (number, optional): Maximum price
- `sort` (string, optional): 'newest', 'popular', 'rating', 'price_low_high', 'price_high_low'
- `limit` (number, optional): Results per page (default: 20, max: 100)
- `page` (number, optional): Page number (default: 1)

**Example Request:**
```bash
GET /api/search?q=phone&minPrice=10000&maxPrice=50000&sort=price_low_high&page=1
```

**Example Response:**
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Samsung Galaxy A13",
      "description": "Budget smartphone with great features",
      "price": 15999,
      "mrp": 19999,
      "discount": 20,
      "rating": 4.2,
      "numReviews": 156,
      "category": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Smartphones",
        "slug": "smartphones"
      }
    }
  ],
  "pagination": {
    "total": 234,
    "page": 1,
    "limit": 20,
    "pages": 12
  }
}
```

**Status Codes:**
- `200`: Success
- `500`: Server error

---

### Get Search Filters

```
GET /api/search/filters
```

**Query Parameters:**
- `q` (string, optional): Search query (to get relevant filters)

**Example Request:**
```bash
GET /api/search/filters?q=phone
```

**Example Response:**
```json
{
  "categories": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Smartphones",
      "count": 156
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Accessories",
      "count": 78
    }
  ],
  "priceRange": {
    "minPrice": 5999,
    "maxPrice": 149999
  },
  "ratings": [
    { "rating": "4★ & above", "value": 4 },
    { "rating": "3★ & above", "value": 3 },
    { "rating": "2★ & above", "value": 2 },
    { "rating": "1★ & above", "value": 1 }
  ],
  "brands": [
    { "name": "Apple", "count": 45 },
    { "name": "Samsung", "count": 78 },
    { "name": "OnePlus", "count": 34 }
  ]
}
```

---

### Get Trending Searches

```
GET /api/search/trending
```

**Example Request:**
```bash
GET /api/search/trending
```

**Example Response:**
```json
{
  "trending": [
    "iPhone 14",
    "Samsung Galaxy",
    "Airpods",
    "iPhone 13",
    "OnePlus 10"
  ]
}
```

---

## Q&A API

### Get Product Q&A

```
GET /api/qa/product/:productId
```

**Path Parameters:**
- `productId` (required): Product MongoDB ID

**Query Parameters:**
- `sort` (string, optional): 'helpful', 'newest', 'unanswered' (default: 'helpful')
- `limit` (number, optional): Results per page (default: 20)
- `page` (number, optional): Page number (default: 1)

**Example Request:**
```bash
GET /api/qa/product/507f1f77bcf86cd799439011?sort=helpful&page=1
```

**Example Response:**
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "product": "507f1f77bcf86cd799439011",
      "question": {
        "text": "Is this product available in India?",
        "askedBy": {
          "_id": "507f1f77bcf86cd799439021",
          "name": "Rajesh Kumar"
        },
        "askedAt": "2024-01-15T10:30:00Z",
        "verified": true
      },
      "answer": {
        "text": "Yes, it is available across India with free shipping.",
        "answeredBy": {
          "_id": "507f1f77bcf86cd799439022",
          "name": "Seller Name"
        },
        "answeredAt": "2024-01-15T11:00:00Z",
        "isOfficial": true
      },
      "communityAnswers": [
        {
          "text": "I bought it and it's amazing!",
          "answeredBy": {
            "_id": "507f1f77bcf86cd799439023",
            "name": "Priya Singh"
          },
          "answeredAt": "2024-01-15T12:00:00Z",
          "verified": true,
          "helpful": 12,
          "notHelpful": 1
        }
      ],
      "helpful": 45,
      "notHelpful": 2,
      "status": "answered",
      "pinned": false
    }
  ],
  "pagination": {
    "total": 156,
    "page": 1,
    "limit": 20,
    "pages": 8
  }
}
```

---

### Ask a Question

```
POST /api/qa
```

**Authentication**: Required (Bearer token)

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439011",
  "question": "Is this product available in XYZ city?"
}
```

**Validation:**
- `question`: Minimum 10 characters required
- `productId`: Must be valid MongoDB ID

**Example Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439030",
  "product": "507f1f77bcf86cd799439011",
  "question": {
    "text": "Is this product available in XYZ city?",
    "askedBy": {
      "_id": "507f1f77bcf86cd799439025",
      "name": "John Doe"
    },
    "askedAt": "2024-01-16T09:00:00Z",
    "verified": true
  },
  "status": "unanswered",
  "helpful": 0,
  "notHelpful": 0
}
```

**Error Responses:**
- `400`: Invalid question (< 10 characters)
- `404`: Product not found
- `500`: Server error

---

### Answer a Question (Seller/Admin)

```
PUT /api/qa/:qaId/answer
```

**Path Parameters:**
- `qaId` (required): Q&A MongoDB ID

**Authentication**: Required (Bearer token)

**Request Body:**
```json
{
  "answer": "Yes, this product is available in all major cities across India."
}
```

**Example Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439030",
  "product": "507f1f77bcf86cd799439011",
  "question": { ... },
  "answer": {
    "text": "Yes, this product is available in all major cities across India.",
    "answeredBy": {
      "_id": "507f1f77bcf86cd799439035",
      "name": "Store Owner"
    },
    "answeredAt": "2024-01-16T10:00:00Z",
    "isOfficial": true
  },
  "status": "answered"
}
```

---

### Add Community Answer

```
POST /api/qa/:qaId/community-answer
```

**Path Parameters:**
- `qaId` (required): Q&A MongoDB ID

**Authentication**: Required (Bearer token)

**Request Body:**
```json
{
  "answer": "I bought this product and it's really good. Works perfectly!"
}
```

**Example Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439030",
  "question": { ... },
  "answer": { ... },
  "communityAnswers": [
    {
      "_id": "507f1f77bcf86cd799439040",
      "text": "I bought this product and it's really good. Works perfectly!",
      "answeredBy": {
        "_id": "507f1f77bcf86cd799439041",
        "name": "User Name"
      },
      "answeredAt": "2024-01-16T11:00:00Z",
      "verified": true,
      "helpful": 0,
      "notHelpful": 0
    }
  ]
}
```

---

### Mark as Helpful

```
POST /api/qa/:qaId/helpful
```

**Authentication**: Required (Bearer token)

**Example Response:**
```json
{
  "helpful": 46,
  "notHelpful": 2
}
```

**Note**: Calling again toggles the vote off

---

### Delete Question

```
DELETE /api/qa/:qaId
```

**Authentication**: Required (Bearer token - must be question asker)

**Example Response:**
```json
{
  "message": "Question deleted successfully"
}
```

**Error Responses:**
- `403`: Not authorized (not the question asker)
- `404`: Question not found

---

## Cart Pricing API

### Get Cart with Pricing

```
GET /api/cart
```

**Authentication**: Required (Bearer token)

**Example Response:**
```json
{
  "_id": "507f1f77bcf86cd799439050",
  "user": "507f1f77bcf86cd799439051",
  "items": [
    {
      "_id": "507f1f77bcf86cd799439052",
      "product": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "iPhone 14 Pro",
        "price": 99999,
        "images": ["https://..."]
      },
      "quantity": 1,
      "price": 99999
    }
  ],
  "pricing": {
    "subtotal": 99999,
    "discount": 0,
    "subtotalAfterDiscount": 99999,
    "tax": 17999.82,
    "taxRate": "18.0%",
    "shipping": 0,
    "shippingFree": true,
    "total": 117998.82,
    "itemCount": 1
  }
}
```

---

### Apply Coupon

```
POST /api/cart/coupon/:couponCode
```

**Path Parameters:**
- `couponCode` (required): Coupon code (case-insensitive)

**Authentication**: Required (Bearer token)

**Example Request:**
```bash
POST /api/cart/coupon/SAVE10
```

**Example Response (200 OK):**
```json
{
  "valid": true,
  "message": "Coupon applied successfully",
  "discount": {
    "type": "percentage",
    "value": 10
  },
  "couponCode": "SAVE10"
}
```

**Error Responses:**
- `400`: Coupon not valid/expired/minimum purchase not met
- `404`: Coupon not found

---

### Calculate Order Total

```
POST /api/cart/calculate
```

**Authentication**: Required (Bearer token)

**Request Body:**
```json
{
  "couponCode": "SAVE10",
  "zipCode": "400001"
}
```

**Example Response:**
```json
{
  "pricing": {
    "subtotal": 99999,
    "discount": 9999.9,
    "subtotalAfterDiscount": 89999.1,
    "tax": 16199.838,
    "taxRate": "18.0%",
    "shipping": 0,
    "shippingFree": true,
    "total": 106198.938,
    "couponCode": "SAVE10",
    "itemCount": 1
  },
  "shippingMethods": [
    {
      "id": "standard",
      "name": "Standard Shipping",
      "duration": "5-7 business days",
      "cost": 0,
      "estimatedDate": "2024-01-25T00:00:00Z"
    },
    {
      "id": "express",
      "name": "Express Shipping",
      "duration": "2-3 business days",
      "cost": 99,
      "estimatedDate": "2024-01-22T00:00:00Z"
    },
    {
      "id": "overnight",
      "name": "Overnight Delivery",
      "duration": "Next day",
      "cost": 199,
      "estimatedDate": "2024-01-21T00:00:00Z"
    }
  ]
}
```

---

### Get Shipping Methods

```
GET /api/cart/shipping
```

**Query Parameters:**
- `subtotal` (required): Order subtotal
- `zipCode` (optional): Delivery zip code

**Example Request:**
```bash
GET /api/cart/shipping?subtotal=50000&zipCode=400001
```

**Example Response:**
```json
[
  {
    "id": "standard",
    "name": "Standard Shipping",
    "duration": "5-7 business days",
    "cost": 40,
    "estimatedDate": "2024-01-25T00:00:00Z"
  },
  {
    "id": "express",
    "name": "Express Shipping",
    "duration": "2-3 business days",
    "cost": 99,
    "estimatedDate": "2024-01-22T00:00:00Z"
  },
  {
    "id": "overnight",
    "name": "Overnight Delivery",
    "duration": "Next day",
    "cost": 199,
    "estimatedDate": "2024-01-21T00:00:00Z"
  }
]
```

---

## Error Handling

### Standard Error Response

```json
{
  "message": "Error description here"
}
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## Authentication

All endpoints requiring authentication expect:

```
Authorization: Bearer <JWT_TOKEN>
```

**Example:**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:5000/api/cart
```

---

## Rate Limiting

- Search: 100 requests/minute
- Q&A: 30 requests/minute
- Cart: 50 requests/minute

---

## Testing with cURL

### Search Example
```bash
curl "http://localhost:5000/api/search?q=phone&sort=price_low_high"
```

### Q&A Example
```bash
curl -H "Authorization: Bearer TOKEN" \
  -X POST http://localhost:5000/api/qa \
  -H "Content-Type: application/json" \
  -d '{"productId":"xyz","question":"Is it good?"}'
```

### Cart Example
```bash
curl -H "Authorization: Bearer TOKEN" \
  -X POST http://localhost:5000/api/cart/calculate \
  -H "Content-Type: application/json" \
  -d '{"couponCode":"SAVE10"}'
```

---

**Version**: 1.0  
**Last Updated**: 2024  
**API Base URL**: `http://localhost:5000/api` (development)
