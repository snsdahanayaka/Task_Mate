const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// All these routes require the user to be logged in
router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

// Sub-Tasks
router.post("/:id/subtasks", taskController.addSubTask);
router.put("/:id/subtasks/:subTaskId", taskController.updateSubTask);
router.post("/auto-generate", taskController.autoGenerateTasksForDay);

// Auto-generate
router.post("/auto-generate", taskController.autoGenerateTasksForDay);

module.exports = router;
