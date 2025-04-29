// server/models/Task.js
const mongoose = require("mongoose");

const subTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
});

const taskSchema = new mongoose.Schema({

  category: { type: String, required: true },
  title: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  subTasks: [subTaskSchema],
  createdAt: { type: Date, default: Date.now },
  dueDate: { type: Date },
});

module.exports = mongoose.model("Task", taskSchema);
