import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import config from './config/index.js';
import { connectDatabase } from './config/database.js';
import { configureCloudinary } from './config/cloudinary.js';
import { configureBrevo } from './config/brevo.js';
import { errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (config.env === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/v1', routes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Gramer Bazar API',
    version: '1.0.0',
    docs: '/api/v1/health',
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use(errorHandler);

const PORT = config.port;

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Configure external services
    configureCloudinary();
    configureBrevo();

    // Start server
    app.listen(PORT, () => {
      console.log(`
    🛒 Gramer Bazar API Server
    Environment: ${config.env.padEnd(29)}
    Port: ${PORT.toString().padEnd(36)}
    URL: http://localhost:${PORT.toString().padEnd(23)}║
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();
