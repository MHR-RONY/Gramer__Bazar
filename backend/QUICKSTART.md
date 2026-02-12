# Quick Start Guide

## Prerequisites Setup

### 1. MongoDB Atlas Setup

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free tier available)
4. Click "Connect" on your cluster
5. Choose "Connect your application"
6. Copy the connection string
7. Replace `<password>` with your database user password
8. Replace `<database>` with your database name (e.g., `gramer-bazar`)

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gramer-bazar?retryWrites=true&w=majority
```

### 2. Cloudinary Setup

1. Visit [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Go to Dashboard
4. Copy the following values:
   - Cloud Name
   - API Key
   - API Secret

### 3. Brevo (Email Service) Setup

1. Visit [Brevo](https://www.brevo.com/)
2. Sign up for a free account
3. Go to Settings > API Keys
4. Create a new API key
5. Copy the API key
6. Verify your sender email address

## Installation Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit the .env file with your credentials
nano .env  # or use any text editor
```

### 3. Build the Project
```bash
npm run build
```

### 4. Run in Development Mode
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Testing the API

### Health Check
```bash
curl http://localhost:5000/api/v1/health
```

### Register a User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Lint code

## Troubleshooting

### MongoDB Connection Error
- Verify your MongoDB connection string
- Check if your IP is whitelisted in MongoDB Atlas (Network Access)
- Ensure your database user has proper permissions

### Cloudinary Upload Error
- Verify your Cloudinary credentials
- Check if you have enough storage in free tier

### Email Not Sending
- Verify your Brevo API key
- Check if sender email is verified in Brevo
- Check your Brevo account quota

### Port Already in Use
Change the PORT in your .env file:
```env
PORT=5001
```

## Next Steps

1. Test all authentication endpoints
2. Create categories for products
3. Add products with images
4. Test order creation
5. Configure production environment variables
6. Deploy to your preferred hosting service

## Support

For issues or questions, please contact:
- Email: support@devstationit.com
- GitHub: [MHR-RONY](https://github.com/MHR-RONY)
