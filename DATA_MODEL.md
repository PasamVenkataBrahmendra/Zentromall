# ZentroMall Data Model

## Entities

### User
| Field | Type | Required | Description |
|---|---|---|---|
| name | String | Yes | Full name of the user |
| email | String | Yes | Email address (unique) |
| password | String | Yes | Hashed password |
| role | String | Yes | 'customer', 'admin', 'seller' (default: 'customer') |
| phone | String | No | Contact number |
| addresses | Array | No | List of shipping addresses |
| createdAt | Date | Yes | Timestamp |

### Seller
| Field | Type | Required | Description |
|---|---|---|---|
| user | ObjectId | Yes | Reference to User |
| storeName | String | Yes | Name of the store |
| description | String | No | Store description |
| logo | String | No | URL to store logo |
| status | String | Yes | 'pending', 'approved', 'rejected' (default: 'pending') |

### Product
| Field | Type | Required | Description |
|---|---|---|---|
| title | String | Yes | Product name |
| slug | String | Yes | URL-friendly identifier (unique) |
| description | String | Yes | Detailed description |
| price | Number | Yes | Selling price |
| mrp | Number | Yes | Maximum Retail Price |
| discount | Number | No | Calculated discount percentage |
| stock | Number | Yes | Inventory count |
| category | ObjectId | Yes | Reference to Category |
| seller | ObjectId | Yes | Reference to Seller |
| images | Array | Yes | List of image URLs |
| tags | Array | No | Search tags |
| rating | Number | No | Average rating (0-5) |
| numReviews | Number | No | Total number of reviews |
| status | String | Yes | 'active', 'inactive' (default: 'active') |

### Category
| Field | Type | Required | Description |
|---|---|---|---|
| name | String | Yes | Category name |
| slug | String | Yes | URL-friendly identifier (unique) |
| image | String | No | Category image URL |
| parent | ObjectId | No | Reference to parent Category (for subcategories) |

### Cart
| Field | Type | Required | Description |
|---|---|---|---|
| user | ObjectId | Yes | Reference to User |
| items | Array | Yes | List of cart items |
| items.product | ObjectId | Yes | Reference to Product |
| items.quantity | Number | Yes | Quantity of product |
| items.price | Number | Yes | Price at time of adding |
| totalPrice | Number | Yes | Total value of cart |

### Order
| Field | Type | Required | Description |
|---|---|---|---|
| user | ObjectId | Yes | Reference to User |
| items | Array | Yes | List of order items (snapshot of cart) |
| shippingAddress | Object | Yes | Delivery address |
| paymentStatus | String | Yes | 'pending', 'paid', 'failed' |
| orderStatus | String | Yes | 'processing', 'shipped', 'delivered', 'cancelled' |
| totalAmount | Number | Yes | Final order amount |

### Review
| Field | Type | Required | Description |
|---|---|---|---|
| user | ObjectId | Yes | Reference to User |
| product | ObjectId | Yes | Reference to Product |
| rating | Number | Yes | Rating (1-5) |
| comment | String | No | Review text |

### Coupon
| Field | Type | Required | Description |
|---|---|---|---|
| code | String | Yes | Coupon code (unique) |
| discountType | String | Yes | 'percentage', 'fixed' |
| discountValue | Number | Yes | Value of discount |
| minPurchase | Number | No | Minimum cart value required |
| expiryDate | Date | Yes | Expiration date |
| isActive | Boolean | Yes | Status |

### Banner
| Field | Type | Required | Description |
|---|---|---|---|
| image | String | Yes | Banner image URL |
| title | String | No | Alt text or title |
| link | String | No | Target URL (internal) |
| active | Boolean | Yes | Display status |

### Reward (ZentroPoints)
| Field | Type | Required | Description |
|---|---|---|---|
| user | ObjectId | Yes | Reference to User |
| points | Number | Yes | Current balance |
| history | Array | No | Transaction history |

### AIShopAnswers
| Field | Type | Required | Description |
|---|---|---|---|
| user | ObjectId | No | Reference to User (optional for guest) |
| answers | Map | Yes | Key-value pairs of questions and answers |
| generatedRecommendations | Array | No | List of recommended product IDs |
