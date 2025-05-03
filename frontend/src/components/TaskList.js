// client/src/components/Task/TaskList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskItem from "./TaskItem";

const styles = {
  container: {
    maxHeight: "400px",
    overflowY: "auto",
    padding: "0.5rem",
  },
};

const TaskList = ({ onTaskSelect, refreshTrigger }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={{ marginBottom: "1rem", fontSize: "1.25rem", color: "#333" }}>Tasks</h3>
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} onSelect={onTaskSelect} />
      ))}
    </div>
  );
};

export default TaskList;