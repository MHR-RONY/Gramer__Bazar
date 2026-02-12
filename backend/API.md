# API Documentation

Base URL: `http://localhost:5000/api/v1`

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user and send email verification OTP.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+8801712345678"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "isEmailVerified": false
  }
}
```

---

### Login
**POST** `/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "isEmailVerified": true
  }
}
```

---

### Verify Email
**POST** `/auth/verify-email/:userId`

Verify email using OTP sent to email.

**Request Body:**
```json
{
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

### Resend OTP
**POST** `/auth/resend-otp/:userId`

Resend OTP for email verification.

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

---

### Forgot Password
**POST** `/auth/forgot-password`

Request password reset link via email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### Reset Password
**POST** `/auth/reset-password/:token`

Reset password using token from email.

**Request Body:**
```json
{
  "password": "newPassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Get Current User
**GET** `/auth/me`

Get currently logged-in user details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "phone": "+8801712345678",
    "addresses": [],
    "isEmailVerified": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Update Profile
**PUT** `/auth/update-profile`

Update user profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "phone": "+8801798765432"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe Updated",
    "email": "john@example.com",
    "phone": "+8801798765432"
  }
}
```

---

## Product Endpoints

### Get All Products
**GET** `/products`

Get paginated list of products with optional filters.

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 12)
- `category` (string) - Filter by category ID
- `search` (string) - Search in name, description, tags
- `minPrice` (number) - Minimum price filter
- `maxPrice` (number) - Maximum price filter
- `isFeatured` (boolean) - Show only featured products

**Example:**
```
GET /products?page=1&limit=12&category=507f1f77bcf86cd799439011&minPrice=10&maxPrice=100
```

**Response:**
```json
{
  "success": true,
  "count": 12,
  "total": 45,
  "totalPages": 4,
  "currentPage": 1,
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Organic Rice",
      "slug": "organic-rice",
      "description": "Premium quality organic rice",
      "price": 150,
      "discountPrice": 120,
      "category": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Grains",
        "slug": "grains"
      },
      "images": [
        {
          "url": "https://res.cloudinary.com/...",
          "public_id": "gramer-bazar/products/..."
        }
      ],
      "stock": 100,
      "unit": "kg",
      "isFeatured": true,
      "ratings": {
        "average": 4.5,
        "count": 25
      }
    }
  ]
}
```

---

### Get Single Product
**GET** `/products/:id`

Get details of a specific product.

**Response:**
```json
{
  "success": true,
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Organic Rice",
    "description": "Premium quality organic rice",
    "price": 150,
    "category": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Grains"
    },
    "images": [...],
    "stock": 100,
    "ratings": {
      "average": 4.5,
      "count": 25
    }
  }
}
```

---

### Create Product
**POST** `/products`

Create a new product (Admin/Vendor only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Organic Rice",
  "description": "Premium quality organic rice",
  "price": 150,
  "discountPrice": 120,
  "category": "507f1f77bcf86cd799439012",
  "images": [
    {
      "url": "https://res.cloudinary.com/...",
      "public_id": "gramer-bazar/products/..."
    }
  ],
  "stock": 100,
  "unit": "kg",
  "weight": 1,
  "sku": "ORG-RICE-001",
  "tags": ["organic", "rice", "grains"],
  "isFeatured": true,
  "nutritionInfo": {
    "calories": 130,
    "protein": 2.7,
    "carbs": 28,
    "fat": 0.3
  }
}
```

**Response:**
```json
{
  "success": true,
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Organic Rice",
    ...
  }
}
```

---

### Update Product
**PUT** `/products/:id`

Update a product (Admin/Vendor only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** (any fields to update)
```json
{
  "price": 140,
  "stock": 150
}
```

**Response:**
```json
{
  "success": true,
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "price": 140,
    "stock": 150,
    ...
  }
}
```

---

### Delete Product
**DELETE** `/products/:id`

Delete a product (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## Health Check

### API Health
**GET** `/health`

Check if API is running.

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Get the token from the login or register response.

---

## Rate Limiting

API requests are rate-limited to prevent abuse:
- Window: 15 minutes
- Max Requests: 100 per window

Exceeding the limit will result in a `429 Too Many Requests` response.
