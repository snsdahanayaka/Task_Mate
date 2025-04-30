// client/src/components/Task/TaskItem.js
import React from "react";
import "./TaskItem.css";

const styles = {
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
    marginBottom: "0.5rem",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  completed: {
    color: "#28a745",
    fontWeight: "500",
  },
};

const TaskItem = ({ task, onSelect, isNextItem, onDelete, onUpdate, onToggleComplete }) => {
  return (
    <div
      className={isNextItem ? "next-item" : ""}
      style={{ ...styles.item, ...(task.isCompleted ? { textDecoration: 'line-through', opacity: 0.7 } : {}) }}
      onClick={() => onSelect(task)}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f1f1f1")}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
    >
      <input
        type="checkbox"
        checked={!!task.isCompleted}
        onChange={e => { e.stopPropagation(); onToggleComplete && onToggleComplete(task); }}
        style={{ marginRight: '0.75rem' }}
        title="Mark as complete"
      />
      <span>
        <strong>{task.category}:</strong> {task.title}
        {isNextItem && <span className="next-item-label">Next Item</span>}
      </span>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button
          style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, padding: '0.25rem 0.75rem', cursor: 'pointer' }}
          onClick={e => { e.stopPropagation(); onDelete && onDelete(task); }}
        >Delete</button>
        <button
          style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 4, padding: '0.25rem 0.75rem', cursor: 'pointer' }}
          onClick={e => { e.stopPropagation(); onUpdate && onUpdate(task); }}
        >Update</button>
      </div>
    </div>
  );
};

export default TaskItem;