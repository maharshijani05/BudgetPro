// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId:{type :Number, required: true, unique: true}, // Unique user ID
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  Savings: { type: Number, default: 0 }, // Savings amount
  income: { type: Number, default: 0 }, // Monthly or annual income
  save_per: { type: Number, default: 0 }, // Percentage of income to save
  tag:{type:String, default:"NA"}, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
