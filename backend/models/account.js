// models/Account.js
const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  accountNumber: { type: String, required: true, unique: true },//len 12
  accountType: { type: String, enum: ["savings", "current"], required: true },
  balance: { type: Number, default: 0 },
  currency: { type: String, default: "INR" },
  createdAt: { type: Date, default: Date.now }
});

// module.exports = mongoose.model("Account", accountSchema);
module.exports = mongoose.models.Account || mongoose.model("Account", accountSchema);
