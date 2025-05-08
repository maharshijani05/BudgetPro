const express = require('express');
const router = express.Router();
const budgetController = require('../Controllers/budgetController');

// Get all budgets
router.get('/', budgetController.getAllBudgets);
router.get('/userid/:userId', budgetController.getBudgetsByUserId);
// Get budget by ID
router.get('/:id', budgetController.getBudgetById);

// Get budgets by Account ID
router.get('/accountid/:accountId', budgetController.getBudgetsByAccountId);

// Get budgets by User ID (through account relation)
router.get('/userid/:userId', budgetController.getBudgetsByUserId);

// Create a new budget
router.post('/', budgetController.createBudget);

// Update a budget by ID
router.put('/:id', budgetController.updateBudget);

// Delete a budget by ID
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;
