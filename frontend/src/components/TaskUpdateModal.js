// client/src/components/Task/TaskUpdateModal.js
import React, { useState, useEffect } from "react";

const TaskUpdateModal = ({ task, open, onClose, onSave }) => {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (task) {
      setCategory(task.category || "");
      setTitle(task.title || "");
      setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
    }
  }, [task]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...task, category, title, dueDate });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>Update Task</h3>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Category:</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Due Date:</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>Cancel</button>
            <button type="submit" style={styles.saveButton}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    borderRadius: 8,
    padding: "2rem",
    minWidth: 320,
    boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
  },
  title: {
    marginBottom: "1rem",
    textAlign: "center",
  },
  formGroup: {
    marginBottom: "0.75rem",
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: 4,
  },
  input: {
    width: "100%",
    padding: "0.25rem",
    border: "1px solid #ccc",
    borderRadius: 4,
  },
  cancelButton: {
    background: "#e5e7eb",
    color: "#222",
    border: "none",
    borderRadius: 4,
    padding: "0.5rem 1rem",
    cursor: "pointer",
  },
  saveButton: {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "0.5rem 1rem",
    cursor: "pointer",
  },
};

export default TaskUpdateModal;
