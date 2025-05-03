const Task = require("../models/Task");

// server/controllers/taskController.js
// exports.getAllTasks = async (req, res) => {
//     try {
//       const tasks = await Task.find();
//       res.json(tasks);
//     } catch (error) {
//       console.error("Error in getAllTasks:", error); // log the detailed error
//       res.status(500).json({ error: "Server error" });
//     }
//   };
  
exports.getAllTasks = async (req, res) => {
  try {
    // Fetch all tasks (no user filtering)
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error("Error in getAllTasks:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// CREATE a task
// exports.createTask = async (req, res) => {
//   try {
//     const { category, title, dueDate } = req.body;
//     const newTask = new Task({
//       user: req.user._id, // from the auth middleware
//       category,
//       title,
//       dueDate: dueDate ? new Date(dueDate) : undefined, // ensure valid Date object or leave undefined
//     });
//     await newTask.save();
//     res.status(201).json(newTask);
//   } catch (error) {
//     console.error("Error in createTask:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };
exports.createTask = async (req, res) => {
  try {
    const { category, title, dueDate } = req.body;
    const newTask = new Task({
      category,
      title,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error in createTask:", error);
    res.status(500).json({ error: "Server error" });
  }
};



// UPDATE a task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(updatedTask);
  } catch (error) {
    console.error("Error in updateTask:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// OPTIONAL: automatically generate tasks if none for a day
// in taskController.js
exports.autoGenerateTasksForDay = async (req, res) => {
    try {
      const { date } = req.body; 
      // Query for tasks with that date (depending on how you store it)
      const tasksForDay = await Task.find({ dueDate: date });
      
      // If no tasks, create default tasks
      if (tasksForDay.length === 0) {
        const defaultTasks = [
          { category: "Education", title: "Learn Java" },
          { category: "Health", title: "Morning Yoga" },
          // ... more tasks
        ];
        await Task.insertMany(defaultTasks.map(t => ({ ...t, dueDate: date })));
        return res.json({ message: "Default tasks created" });
      } else {
        return res.json({ message: "Tasks already exist for that date" });
      }
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };
  

  // TOGGLE or UPDATE a sub-task
exports.updateSubTask = async (req, res) => {
  try {
    const { id, subTaskId } = req.params;
    const { isCompleted } = req.body;

    // Find the parent task
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Find the subtask inside the array
    const subTask = task.subTasks.id(subTaskId);
    if (!subTask) {
      return res.status(404).json({ error: "Sub-task not found" });
    }

    // Update the sub-task fields
    if (typeof isCompleted !== "undefined") {
      subTask.isCompleted = isCompleted;
    }

    // Optionally update the title or other fields if needed
    // if (req.body.title) subTask.title = req.body.title;

    await task.save();
    res.json(task);
  } catch (error) {
    console.error("Error in updateSubTask:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// exports.getTaskById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ error: "Task not found" });
//     }
//     res.json(task);
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// };
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    console.error("Error in getTaskById:", error);
    res.status(500).json({ error: "Server error" });
  }
};



// ADD a new sub-task to an existing task
exports.addSubTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    task.subTasks.push({ title });
    await task.save();
    res.json(task);
  } catch (error) {
    console.error("Error in addSubTask:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// AUTO-GENERATE tasks if none exist for a particular date
exports.autoGenerateTasksForDay = async (req, res) => {
  try {
    const { date } = req.body; // e.g., "2025-03-21"

    // Convert date string to a real Date object if needed
    const targetDate = new Date(date);
    // We'll assume the day starts at midnight for searching:
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    // Find tasks that have a dueDate within this day
    const tasksForDay = await Task.find({
      dueDate: { $gte: startOfDay, $lte: endOfDay },
    });

    if (tasksForDay.length === 0) {
      // create default tasks
      const defaultTasks = [
        { category: "Education", title: "Read an article", dueDate: startOfDay },
        { category: "Health", title: "30-minute exercise", dueDate: startOfDay },
      ];
      const createdTasks = await Task.insertMany(defaultTasks);
      return res.json({ message: "Default tasks created", createdTasks });
    }

    return res.json({ message: "Tasks already exist for this date" });
  } catch (error) {
    console.error("Error in autoGenerateTasksForDay:", error);
    res.status(500).json({ error: "Server error" });
  }
};



// // server/controllers/taskController.js
// const Task = require("../models/Task");

// exports.getAllTasks = async (req, res) => {
//   try {
//     // Only fetch tasks for this user
//     const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
//     res.json(tasks);
//   } catch (error) {
//     console.error("Error in getAllTasks:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// exports.getTaskById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     // Make sure the task belongs to the logged-in user
//     const task = await Task.findOne({ _id: id, user: req.user._id });
//     if (!task) {
//       return res.status(404).json({ error: "Task not found" });
//     }
//     res.json(task);
//   } catch (error) {
//     console.error("Error in getTaskById:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// exports.createTask = async (req, res) => {
//   try {
//     const { category, title, dueDate } = req.body;
//     const newTask = new Task({
//       user: req.user._id, // attach the logged-in user
//       category,
//       title,
//       dueDate,
//     });
//     await newTask.save();
//     res.status(201).json(newTask);
//   } catch (error) {
//     console.error("Error in createTask:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// exports.updateTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     // Ensure the task belongs to this user
//     const updatedTask = await Task.findOneAndUpdate(
//       { _id: id, user: req.user._id },
//       req.body,
//       { new: true }
//     );
//     if (!updatedTask) {
//       return res.status(404).json({ error: "Task not found" });
//     }
//     res.json(updatedTask);
//   } catch (error) {
//     console.error("Error in updateTask:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// exports.deleteTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedTask = await Task.findOneAndDelete({
//       _id: id,
//       user: req.user._id,
//     });
//     if (!deletedTask) {
//       return res.status(404).json({ error: "Task not found" });
//     }
//     res.json({ message: "Task deleted successfully" });
//   } catch (error) {
//     console.error("Error in deleteTask:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

