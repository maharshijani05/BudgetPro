const Goal = require("../models/goal");

// Create a new goal
exports.createGoal = async (req, res) => {
  try {
    const goal = new Goal(req.body);
    await goal.save();
    res.status(201).json(goal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id).populate("userId").populate("accountId");
    if (!goal) return res.status(404).json({ message: "Goal not found" });
    res.status(200).json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
// Get all goals
exports.getAllGoals = async (req, res) => {
  try {
    const goals = await Goal.find().populate("userId").populate("accountId");
    res.status(200).json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get goals by userId
exports.getGoalsByUser = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.params.userId }).populate("accountId");
    res.status(200).json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a goal
exports.updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!goal) return res.status(404).json({ message: "Goal not found" });
    res.status(200).json(goal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a goal
exports.deleteGoal = async (req, res) => {
  try {
    const result = await Goal.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Goal not found" });
    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
