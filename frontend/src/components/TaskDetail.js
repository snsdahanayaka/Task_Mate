// client/src/components/Task/TaskDetail.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const styles = {
  card: {
    backgroundColor: "#ffffff",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#333",
    marginBottom: "1rem",
  },
  detail: {
    fontSize: "1rem",
    color: "#555",
    marginBottom: "0.5rem",
  },
  button: {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    marginRight: "0.5rem",
    transition: "background-color 0.3s ease",
  },
  completeButton: {
    backgroundColor: "#28a745",
    color: "#fff",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
  },
  subTaskForm: {
    display: "flex",
    gap: "0.5rem",
    marginTop: "1rem",
  },
  subTaskInput: {
    flex: 1,
    padding: "0.5rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  subTaskButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  subTaskList: {
    marginTop: "1rem",
  },
  subTaskItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.5rem",
  },
};

const TaskDetail = ({ selectedTaskId, onTaskUpdated, onTaskDeleted }) => {
  const [task, setTask] = useState(null);
  const [subTaskTitle, setSubTaskTitle] = useState("");

  useEffect(() => {
    if (selectedTaskId) {
      fetchTaskDetail(selectedTaskId);
    }
  }, [selectedTaskId]);

  const fetchTaskDetail = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tasks/${id}`);
      setTask(response.data);
    } catch (error) {
      console.error("Error fetching task detail:", error);
    }
  };

  const handleToggleComplete = async () => {
    if (!task) return;
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/${task._id}`, {
        isCompleted: !task.isCompleted,
      });
      setTask(response.data);
      onTaskUpdated();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async () => {
    if (!task) return;
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${task._id}`);
      onTaskDeleted();
      setTask(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleAddSubTask = async (e) => {
    e.preventDefault();
    if (!subTaskTitle.trim() || !task) return;
    try {
      const response = await axios.post(
        `http://localhost:5000/api/tasks/${task._id}/subtasks`,
        { title: subTaskTitle }
      );
      setTask(response.data);
      setSubTaskTitle("");
    } catch (error) {
      console.error("Error adding sub-task:", error);
    }
  };

  const handleToggleSubTask = async (subTaskId, currentStatus) => {
    if (!task) return;
    try {
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${task._id}/subtasks/${subTaskId}`,
        { isCompleted: !currentStatus }
      );
      setTask(response.data);
    } catch (error) {
      console.error("Error toggling sub-task:", error);
    }
  };

  if (!selectedTaskId) {
    return <div style={styles.card}>Select a task to see details</div>;
  }

  if (!task) {
    return <div style={styles.card}>Loading task details...</div>;
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Task Detail</h3>
      <p style={styles.detail}>
        <strong>Category:</strong> {task.category}
      </p>
      <p style={styles.detail}>
        <strong>Title:</strong> {task.title}
      </p>
      <p style={styles.detail}>
        <strong>Due:</strong>{" "}
        {task.dueDate
          ? new Date(task.dueDate).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric"
            })
          : "No due date"}
      </p>
      <p style={styles.detail}>
        <strong>Status:</strong> {task.isCompleted ? "Completed" : "Not Completed"}
      </p>
      <button
        onClick={handleToggleComplete}
        style={{ ...styles.button, ...styles.completeButton }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#218838")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#28a745")}
      >
        {task.isCompleted ? "Mark Incomplete" : "Mark Complete"}
      </button>
      <button
        onClick={handleDeleteTask}
        style={{ ...styles.button, ...styles.deleteButton }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c82333")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#dc3545")}
      >
        Delete Task
      </button>

      <h4 style={{ marginTop: "1.5rem", fontSize: "1.25rem", color: "#333" }}>
        Sub-Tasks
      </h4>
      {task.subTasks && task.subTasks.length > 0 ? (
        <div style={styles.subTaskList}>
          {task.subTasks.map((sub) => (
            <div key={sub._id} style={styles.subTaskItem}>
              <input
                type="checkbox"
                checked={sub.isCompleted}
                onChange={() => handleToggleSubTask(sub._id, sub.isCompleted)}
              />
              <span style={{ textDecoration: sub.isCompleted ? "line-through" : "none" }}>
                {sub.title}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p>No sub-tasks yet.</p>
      )}

      <form onSubmit={handleAddSubTask} style={styles.subTaskForm}>
        <input
          type="text"
          placeholder="Sub-task title"
          value={subTaskTitle}
          onChange={(e) => setSubTaskTitle(e.target.value)}
          style={styles.subTaskInput}
        />
        <button type="submit" style={styles.subTaskButton}>
          Add Sub-Task
        </button>
      </form>
    </div>
  );
};

export default TaskDetail;