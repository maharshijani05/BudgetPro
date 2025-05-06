const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  foodAndDining: { type: Number, default: 0 },
  shopping: { type: Number, default: 0 },
  entertainment: { type: Number, default: 0 },
  travel: { type: Number, default: 0 },
  health: { type: Number, default: 0 },
  education: { type: Number, default: 0 },
  rechargeAndSubscriptions: { type: Number, default: 0 },
  others: { type: Number, default: 0 },
  transportation: { type: Number, default: 0 },
  billsAndUtilities: { type: Number, default: 0 },
  limitAmount: { type: Number, default: 0 },
  
  month: { type: String, required: true },
  year: { type: Number, required: true },
  saving: { type: Number, default: 0 },
});

module.exports = mongoose.model("Budget", budgetSchema);
