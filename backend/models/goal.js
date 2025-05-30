const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true
  },
  goalName: {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ["car","bike","others"],
    default: "other"
  },
  upfront: {
    type: Number,
    default: 20
  },
  emi: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number, // duration in months
    required: false,
    default:6
  },
  remainingAmount: {
    type: Number,
    default: function () {
      return this.totalAmount - this.upfront;
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Goal", goalSchema);
