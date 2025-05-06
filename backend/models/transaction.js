// models/Transaction.js
const mongoose = require("mongoose");
const user = require("./user");

const MAIN_CATEGORIES = [
  "Food and Dining",
  "Transportation",
  "Shopping",
  "Bills and Utilities",
  "Entertainment",
  "Travel",
  "Health",
  "Education",
  "Recharge and Subscriptions",
  "Others",
  "NA"
];




const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  // amount: { type: Number, required: true },
  debit: { type: Number, required: true }, // Amount spent (debit)
  credit: { type: Number, required: true }, // Amount received (credit)
  balance: { type: Number, required: true }, // Account balance after transaction
  type: { type: String, enum: ["debit card", "credit card","cash","wallet","net banking","UPI"], required: true },
  category: { type: String, enum: MAIN_CATEGORIES, default: "NA" },
  sender_id: { type: String, required: true }, // ID of the sender (if applicable)
  receiver_id: { type: String, required: true }, // ID of the receiver (if applicable)
});

module.exports = mongoose.model("Transaction", transactionSchema);
