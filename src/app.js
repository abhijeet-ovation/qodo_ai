const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const itemRoutes = require('./routes/items');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/items', itemRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Qodo AI API',
    version: '1.0.0',
    description: 'AI-powered item management API',
    endpoints: {
      items: '/api/items',
      health: '/health'
    },
    features: [
      'CRUD operations for items',
      'AI-powered insights generation',
      'Smart search with semantic understanding',
      'Sentiment analysis',
      'Automated test case generation',
      'Item recommendations'
    ]
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: [
      'GET /api/items',
      'GET /api/items/:id',
      'POST /api/items',
      'PUT /api/items/:id',
      'DELETE /api/items/:id',
      'GET /api/items/:id/insights',
      'GET /api/items/:id/sentiment',
      'GET /api/items/search/ai',
      'GET /api/items/recommendations',
      'GET /health',
      'GET /api'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    error: error.name || 'Internal Server Error',
    message: error.message || 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

module.exports = app; 