// client/src/components/Task/TaskForm.js
import React, { useState } from "react";
import axios from "axios";

const TaskForm = ({ onTaskAdded }) => {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/tasks", {
        category,
        title,
        dueDate,
      });
      if (onTaskAdded) onTaskAdded(response.data); // callback to refresh list
      setCategory("");
      setTitle("");
      setDueDate("");
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={styles.title}>Create a Task</h3>
      <div style={styles.formGroup}>
        <label style={styles.label}>Category: </label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.input}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Title: </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Due Date: </label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={styles.input}
        />
      </div>
      <button type="submit" style={styles.button}>Add Task</button>
    </form>
  );
};

const styles = {
  form: {
    marginBottom: "1rem",
    padding: "1rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  title: {
    textAlign: "center",
    marginBottom: "1rem",
  },
  formGroup: {
    marginBottom: "0.75rem",
  },
  label: {
    display: "block",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "0.25rem",
    border: "1px solid #ccc",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
  },
};

export default TaskForm;