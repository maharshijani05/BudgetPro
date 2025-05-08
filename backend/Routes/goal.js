const express = require("express");
const router = express.Router();
const goalController = require("../Controllers/goalController");

router.post("/", goalController.createGoal);
router.get("/", goalController.getAllGoals);
router.get("/user/:userId", goalController.getGoalsByUser);
router.get("/:id", goalController.getGoalById);
router.put("/:id", goalController.updateGoal);
router.delete("/:id", goalController.deleteGoal);

module.exports = router;
