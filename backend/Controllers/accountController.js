const Account = require('../models/account');

// Get all accounts
exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve accounts', error });
  }
};

// Get account by ID
exports.getAccountById = async (req, res) => {
  try {
    const account = await Account.findById(req.params.accountId);
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve account', error });
  }
};

// Get accounts by user ID
exports.getAccountsByUserId = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.params.userId });
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve accounts by user ID', error });
  }
};

// Create a new account
exports.createAccount = async (req, res) => {
  try {
    const account = new Account(req.body);
    const savedAccount = await account.save();
    res.status(201).json(savedAccount);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create account', error });
  }
};

// Update an account
exports.updateAccount = async (req, res) => {
  try {
    const updatedAccount = await Account.findByIdAndUpdate(req.params.accountId, req.body, {
      new: true,
    });
    if (!updatedAccount) return res.status(404).json({ message: 'Account not found' });
    res.status(200).json(updatedAccount);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update account', error });
  }
};

// Delete an account
exports.deleteAccount = async (req, res) => {
  try {
    const deletedAccount = await Account.findByIdAndDelete(req.params.accountId);
    if (!deletedAccount) return res.status(404).json({ message: 'Account not found' });
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete account', error });
  }
};
