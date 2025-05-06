const express = require('express');
const router = express.Router();
const transactionController = require('../Controllers/transactionController');

// Get all transactions
router.get('/', transactionController.getAllTransactions);

// Get transaction by ID
router.get('/:id', transactionController.getTransactionById);

// Get transactions by Account ID
router.get('/accountid/:accountId', transactionController.getTransactionsByAccountId);

// Get transactions by User ID (through account relationship)
router.get('/userid/:userId', transactionController.getTransactionsByUserId);

// Create a new transaction
router.post('/', transactionController.createTransaction);

// Update a transaction
router.put('/:id', transactionController.updateTransaction);

// Delete a transaction
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
