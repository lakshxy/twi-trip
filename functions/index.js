const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const { registerRoutes } = require('./server/routes');
const { storage } = require('./server/storage');

// Create Express app
const app = express();

// CORS setup for Firebase Functions
app.use(cors({ origin: true }));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register routes
registerRoutes(app);

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);