const express = require('express');
const router = express.Router();
const accountController = require('../Controllers/accountController');

// Route to get all accounts
router.get('/', accountController.getAllAccounts);

// Route to get accounts by user ID
router.get('/getbyuserid/:userId', accountController.getAccountsByUserId);

// Route to get a specific account by account ID
router.get('/:accountId', accountController.getAccountById);

// Route to create a new account
router.post('/', accountController.createAccount);

// Route to update an account by ID
router.put('/:accountId', accountController.updateAccount);

// Route to delete an account by ID
router.delete('/:accountId', accountController.deleteAccount);

module.exports = router;
