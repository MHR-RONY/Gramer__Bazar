# Gramer Bazar — Traditional Food Store

> দেশি-খাঁটি খাবারের অনলাইন শপ

**Author:** [MHR Rony](https://mhrrony.com) — Founder & CEO, [DevStation IT](https://devstationit.com)

## Project Structure

This project consists of two main parts:

### Frontend (React + Vite)
- Modern React application with TypeScript
- Vite for fast development
- shadcn-ui components
- Tailwind CSS for styling

### Backend (Node.js + Express + MongoDB) 🆕
- RESTful API with Express.js
- MongoDB Atlas for database
- Cloudinary for image storage
- Brevo for email/OTP services
- JWT authentication
- Role-based access control

## Quick Start

### Frontend Setup

```sh
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

```sh
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env

# Edit .env with your credentials
# (MongoDB URI, Cloudinary keys, Brevo API key)

# Start development server
npm run dev
```

📚 **Full backend documentation:** See [backend/README.md](backend/README.md)

## What technologies are used for this project?

### Frontend
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

### Backend 🆕
- Node.js with Express.js
- TypeScript
- MongoDB Atlas
- Cloudinary (image storage)
- Brevo (email/OTP)
- JWT authentication
- bcrypt (password hashing)
- Helmet & CORS (security)

## Documentation

- **Frontend:** Instructions in this file
- **Backend:** [backend/README.md](backend/README.md)
- **API Reference:** [backend/API.md](backend/API.md)
- **Quick Start Guide:** [backend/QUICKSTART.md](backend/QUICKSTART.md)
- **Implementation Summary:** [backend/IMPLEMENTATION_SUMMARY.md](backend/IMPLEMENTATION_SUMMARY.md)

## How can I edit this code?

You can clone this repo and work locally with your preferred IDE.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the frontend dependencies.
npm i

# Step 4: Install the backend dependencies.
cd backend && npm i && cd ..

# Step 5: Configure backend environment variables
cd backend && cp .env.example .env
# Edit .env with your credentials

# Step 6: Start the backend server (in one terminal)
cd backend && npm run dev

# Step 7: Start the frontend server (in another terminal)
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## API Endpoints

The backend provides the following API endpoints:

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/verify-email/:userId` - Verify email
- `POST /api/v1/auth/forgot-password` - Request password reset
- And more...

### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get single product
- `POST /api/v1/products` - Create product (Admin/Vendor)
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

For complete API documentation, see [backend/API.md](backend/API.md)

## How can I deploy this project?

### Frontend Deployment
Deploy using any static hosting provider (Vercel, Netlify, etc.).

### Backend Deployment
Deploy to:
- Railway
- Heroku
- AWS (EC2, Elastic Beanstalk)
- DigitalOcean
- Google Cloud Platform

Make sure to:
1. Set up production environment variables
2. Configure MongoDB Atlas production cluster
3. Set up Cloudinary production account
4. Configure Brevo for production emails
5. Enable SSL/TLS
6. Set up domain and DNS

## Support

For questions or issues:
- Email: support@devstationit.com
- GitHub: [MHR-RONY](https://github.com/MHR-RONY)
