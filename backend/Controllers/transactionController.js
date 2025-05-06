const Transaction = require('../models/transaction');
const Account = require('../models/account');
const User = require('../models/user');
const mongoose = require('mongoose');

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('accountId');
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
};

// Get transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate('accountId');
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transaction', error });
  }
};

// Get transactions by Account ID
exports.getTransactionsByAccountId = async (req, res) => {
  try {
    const transactions = await Transaction.find({ accountId: req.params.accountId });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions by account', error });
  }
};

// Get transactions by User ID (through accounts)
exports.getTransactionsByUserId = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.params.userId }).select('_id');
    const accountIds = accounts.map(account => account._id);
    const transactions = await Transaction.find({ accountId: { $in: accountIds } });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions by user', error });
  }
};

// Create a transaction

exports.createTransaction = async (req, res) => {
  try {
    const {
      accountId,
      date,
      description,
      debit,
      credit,
      type,
      category,
      sender_id,
      receiver_id
    } = req.body;

    // Verify that sender_id and receiver_id exist (these are account _id values)
    const senderAccount = await Account.findById(sender_id);
    const receiverAccount = await Account.findById(receiver_id);

    // Case handling based on sender and receiver existence
    if (senderAccount && receiverAccount) {
      // Case 1: Both sender and receiver exist in our database
      
      // Update sender account balance
      const senderPreviousBalance = senderAccount.balance;
      senderAccount.balance = senderAccount.balance - debit + credit;
      await senderAccount.save();

      // Create sender transaction
      const senderTransaction = new Transaction({
        userId: senderAccount.userId,
        accountId: senderAccount._id,
        date: date || new Date(),
        description,
        debit,
        credit: 0, // Sender is debiting money
        balance: senderAccount.balance,
        type,
        category,
        sender_id,
        receiver_id
      });
      await senderTransaction.save();

      // Update receiver account balance
      const receiverPreviousBalance = receiverAccount.balance;
      receiverAccount.balance = receiverAccount.balance - 0 + debit; // Receiver is credited with debit amount
      await receiverAccount.save();

      // Create receiver transaction
      const receiverTransaction = new Transaction({
        userId: receiverAccount.userId,
        accountId: receiverAccount._id,
        date: date || new Date(),
        description,
        debit: 0, // No debit for receiver
        credit: debit, // Receiver is credited with debit amount from sender
        balance: receiverAccount.balance,
        type,
        category,
        sender_id,
        receiver_id
      });
      await receiverTransaction.save();

      return res.status(201).json({
        success: true,
        message: "Transaction completed successfully between accounts",
        data: {
          senderTransaction,
          receiverTransaction
        }
      });

    } else if (senderAccount) {
      // Case 2: Only sender exists in our database
      // Update sender account balance
      const previousBalance = senderAccount.balance;
      senderAccount.balance = senderAccount.balance - debit + credit;
      await senderAccount.save();

      // Create transaction for sender
      const transaction = new Transaction({
        userId: senderAccount.userId,
        accountId: senderAccount._id,
        date: date || new Date(),
        description,
        debit,
        credit,
        balance: senderAccount.balance,
        type,
        category,
        sender_id,
        receiver_id
      });
      await transaction.save();

      return res.status(201).json({
        success: true,
        message: "Transaction created for sender account",
        data: transaction
      });

    } else if (receiverAccount) {
      // Case 3: Only receiver exists in our database
      // Update receiver account balance
      const previousBalance = receiverAccount.balance;
      receiverAccount.balance = receiverAccount.balance - debit + credit;
      await receiverAccount.save();

      // Create transaction for receiver
      const transaction = new Transaction({
        userId: receiverAccount.userId,
        accountId: receiverAccount._id,
        date: date || new Date(),
        description,
        debit,
        credit,
        balance: receiverAccount.balance,
        type,
        category,
        sender_id,
        receiver_id
      });
      await transaction.save();

      return res.status(201).json({
        success: true,
        message: "Transaction created for receiver account",
        data: transaction
      });

    } else {
      // Case 4: Neither sender nor receiver exists in our database
      return res.status(404).json({
        success: false,
        message: "No matching accounts found for the transaction"
      });
    }

  } catch (error) {
    console.error("Error creating transaction:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create transaction",
      error: error.message
    });
  }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTransaction) return res.status(404).json({ message: 'Transaction not found' });
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: 'Error updating transaction', error });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!deletedTransaction) return res.status(404).json({ message: 'Transaction not found' });
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting transaction', error });
  }
};
