// Load environment variables from the .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose'); // Import Mongoose for database connection
const app = express();

const port = process.env.PORT || 3000;
const databaseUrl = process.env.DATABASE_URL;

// Connect to the database
mongoose
    .connect(databaseUrl)
    .then(() => {
        console.log('Connected to the database successfully!');
    })
    .catch((error) => {
        console.error('Database connection failed:', error.message);
        process.exit(1); // Exit if the connection fails
    });

// Import routes
const accountRoutes = require('./Routes/account');
const alertRoutes = require('./Routes/alert');
const userRoutes = require('./Routes/user');
const budgetRoutes = require('./Routes/budget');
const transactionRoutes = require('./Routes/transaction');

// Add headers to handle CORS Errors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Specify the allowed origin
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200); // Respond with 200 for preflight requests
    }

    next();
});

// Middleware for parsing JSON
app.use(express.json());

// Route definitions
app.use('/user', userRoutes);
app.use('/account', accountRoutes);
app.use('/alert', alertRoutes);
app.use('/budget', budgetRoutes);
app.use('/transaction', transactionRoutes);
// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the smart financial assistant  API!');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
