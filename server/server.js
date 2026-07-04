// Load environment variables from .env file at the very start
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize the Express application
const app = express();

// Set the server port and frontend client URL with fallbacks
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Configure CORS (Cross-Origin Resource Sharing)
// This allows the React development frontend to securely call our Express API
app.use(cors({
  origin: CLIENT_URL,
  credentials: true // Enables sending cookies/headers if needed in the future
}));

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Middleware to parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// GET /api/test - Endpoint to verify the backend is running
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HRMS Backend is working successfully!',
    timestamp: new Date().toISOString()
  });
});

// Basic 404 Handler - Triggers when no active routes match the incoming request
app.use((req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Passes the error to the global error handler
});

// Basic Global Error Handling Middleware
// Automatically catches errors thrown in handlers or passed via next(error)
app.use((err, req, res, next) => {
  // If status code hasn't been set, default to 500 (Internal Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Only display full error stack trace in development mode
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Connect to Database
connectDB();

// Start the Express server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 HRMS Backend Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📡 Listening on Port: ${PORT}`);
  console.log(`🔗 API Test Endpoint: http://localhost:${PORT}/api/test`);
  console.log(`==================================================`);
});
