const Budget = require('../models/budget');
const Account = require('../models/account');

// Get all budgets
exports.getAllBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find();
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve budgets', error });
  }
};

// Get budget by ID
exports.getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve budget', error });
  }
};

// Get budgets by accountId
exports.getBudgetsByAccountId = async (req, res) => {
  try {
    const budgets = await Budget.find({ accountId: req.params.accountId });
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve budgets by account ID', error });
  }
};

// Get budgets by userId (through account)
exports.getBudgetsByUserId = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.params.userId }).select('_id');
    const accountIds = accounts.map(acc => acc._id);
    const budgets = await Budget.find({ accountId: { $in: accountIds } });
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve budgets by user ID', error });
  }
};

// Create a new budget
exports.createBudget = async (req, res) => {
  try {
    const budget = new Budget(req.body);
    const savedBudget = await budget.save();
    res.status(201).json(savedBudget);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create budget', error });
  }
};

// Update budget by ID
exports.updateBudget = async (req, res) => {
  try {
    const updatedBudget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedBudget) return res.status(404).json({ message: 'Budget not found' });
    res.status(200).json(updatedBudget);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update budget', error });
  }
};

// Delete budget by ID
exports.deleteBudget = async (req, res) => {
  try {
    const deletedBudget = await Budget.findByIdAndDelete(req.params.id);
    if (!deletedBudget) return res.status(404).json({ message: 'Budget not found' });
    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete budget', error });
  }
};
