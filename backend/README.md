# Gramer Bazar Backend API

Backend API for Gramer Bazar - Traditional Food Store, built with Node.js, Express, TypeScript, MongoDB, Cloudinary, and Brevo.

## 🚀 Features

- **Authentication & Authorization**
  - User registration with email verification (OTP)
  - Login with JWT tokens
  - Password reset functionality
  - Role-based access control (Customer, Vendor, Admin)

- **Product Management**
  - CRUD operations for products
  - Image upload with Cloudinary
  - Product search and filtering
  - Category management
  - Stock management

- **Order Management**
  - Order creation and tracking
  - Order status updates
  - Email notifications

- **Email Service**
  - Email verification with OTP (Brevo)
  - Password reset emails
  - Order confirmation emails

- **Security**
  - JWT authentication
  - Password hashing with bcrypt
  - Rate limiting
  - CORS protection
  - Helmet security headers

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account
- Cloudinary account
- Brevo (Sendinblue) account

## 🛠️ Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file by copying `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:

### MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string and add it to `MONGODB_URI`

### Cloudinary Setup
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up and get your credentials
3. Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`

### Brevo Setup
1. Go to [Brevo](https://www.brevo.com/)
2. Sign up and get your API key
3. Add `BREVO_API_KEY` and configure sender email

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/verify-email/:userId` - Verify email with OTP
- `POST /api/v1/auth/resend-otp/:userId` - Resend OTP
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password/:token` - Reset password
- `GET /api/v1/auth/me` - Get current user (Protected)
- `PUT /api/v1/auth/update-profile` - Update profile (Protected)

### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get single product
- `POST /api/v1/products` - Create product (Admin/Vendor)
- `PUT /api/v1/products/:id` - Update product (Admin/Vendor)
- `DELETE /api/v1/products/:id` - Delete product (Admin)

### Health Check
- `GET /api/v1/health` - Check API health

## 🗄️ Database Models

### User
- Name, email, password
- Role (customer, vendor, admin)
- Avatar (Cloudinary)
- Addresses
- Email verification status
- Phone number

### Product
- Name, description, price
- Category reference
- Images (Cloudinary)
- Stock, unit, weight
- SKU, tags
- Featured status
- Ratings
- Nutrition info

### Category
- Name, slug
- Description
- Image (Cloudinary)
- Parent category (for subcategories)
- Active status

### Order
- User reference
- Order items (products)
- Shipping address
- Payment info
- Order status
- Timestamps

## 🔐 Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Brevo
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=noreply@gramerbazar.com
BREVO_SENDER_NAME=Gramer Bazar

# CORS
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── index.ts      # Main config
│   │   ├── database.ts   # MongoDB connection
│   │   ├── cloudinary.ts # Cloudinary setup
│   │   └── brevo.ts      # Brevo email setup
│   ├── controllers/      # Route controllers
│   │   ├── authController.ts
│   │   └── productController.ts
│   ├── models/           # Database models
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Category.ts
│   │   └── Order.ts
│   ├── routes/           # API routes
│   │   ├── authRoutes.ts
│   │   ├── productRoutes.ts
│   │   └── index.ts
│   ├── middleware/       # Custom middleware
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── asyncHandler.ts
│   ├── services/         # External services
│   │   ├── emailService.ts
│   │   └── cloudinaryService.ts
│   ├── utils/            # Utility functions
│   │   ├── jwt.ts
│   │   └── tokenGenerator.ts
│   └── server.ts         # Main server file
├── .env.example          # Example environment variables
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript configuration
```

## 🧪 Testing

```bash
npm test
```

## 📝 License

MIT

## 👨‍💻 Author

**MHR Rony** - Founder & CEO, [DevStation IT](https://devstationit.com)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if this project helped you!
