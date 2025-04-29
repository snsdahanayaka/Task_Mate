// client/src/pages/TaskReportPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const getMonthName = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString("default", { month: "long" });
};

const getSummary = (tasks) => {
  const completed = tasks.filter(t => t.isCompleted).length;
  const total = tasks.length;
  const improvement = [];
  if (total === 0) return { completed, total, improvement, summary: "No tasks found." };
  if (completed/total < 0.7) improvement.push("Try to complete more tasks next month.");
  if (tasks.some(t => !t.dueDate)) improvement.push("Set due dates for all tasks.");
  if (tasks.filter(t => t.isCompleted && t.dueDate && new Date(t.dueDate) < new Date()).length)
    improvement.push("Complete tasks before their due dates.");
  return {
    completed,
    total,
    improvement,
    summary: `You completed ${completed} out of ${total} tasks this month.`
  };
};

const TaskReportPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [summary, setSummary] = useState({ completed: 0, total: 0, improvement: [], summary: "" });

  useEffect(() => {
    const fetchAllTasks = async () => {
      // Ensure Authorization header is set for axios
      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      setLoading(true);
      setError("");
      try {
        const response = await axios.get("http://localhost:5000/api/tasks");
        // Filter tasks for current month
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const monthlyTasks = response.data.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          return dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear;
        });
        setTasks(monthlyTasks);
        setSummary(getSummary(monthlyTasks));
      } catch (err) {
        setError("Failed to load tasks.");
      }
      setLoading(false);
    };

    fetchAllTasks();
  }, []);

  // Chart data
  const barData = {
    labels: ["Completed", "Incomplete"],
    datasets: [
      {
        label: "Tasks",
        data: [summary.completed, summary.total - summary.completed],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderRadius: 6,
      },
    ],
  };
  const pieData = {
    labels: ["Completed", "Incomplete"],
    datasets: [
      {
        data: [summary.completed, summary.total - summary.completed],
        backgroundColor: ["#16a34a", "#f87171"],
      },
    ],
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Current Report</h1>
      {loading ? (
        <div style={styles.loading}>Loading...</div>
      ) : error ? (
        <div style={styles.error}>{error}</div>
      ) : (
        <>
          <div style={styles.summaryBox}>
            <h2 style={styles.subtitle}>Summary</h2>
            <p>{summary.summary}</p>
            {summary.improvement.length > 0 && (
              <ul style={styles.improveList}>
                {summary.improvement.map((imp, i) => (
                  <li key={i} style={styles.improveItem}>{imp}</li>
                ))}
              </ul>
            )}
          </div>
          <div style={styles.chartsBox}>
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Completion Bar Chart</h3>
              <Bar data={barData} options={{ plugins: { legend: { display: false } } }} />
            </div>
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Completion Pie Chart</h3>
              <Pie data={pieData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 700,
    margin: "2rem auto",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    padding: "2rem 2.5rem",
    fontFamily: "'Inter', sans-serif",
  },
  title: {
    textAlign: "center",
    fontWeight: 700,
    fontSize: "2rem",
    marginBottom: "1.5rem",
    color: "#2563eb",
  },
  loading: {
    textAlign: "center",
    color: "#888",
    fontSize: "1.2rem",
  },
  error: {
    color: "#dc2626",
    textAlign: "center",
    fontWeight: 600,
  },
  summaryBox: {
    background: "#f1f5f9",
    borderRadius: 8,
    padding: "1.5rem",
    marginBottom: "2rem",
  },
  subtitle: {
    fontWeight: 600,
    fontSize: "1.2rem",
    marginBottom: 8,
  },
  improveList: {
    marginTop: 10,
    paddingLeft: 20,
  },
  improveItem: {
    color: "#b91c1c",
    fontWeight: 500,
    marginBottom: 4,
  },
  chartsBox: {
    display: "flex",
    gap: "2rem",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  chartCard: {
    background: "#f9fafb",
    padding: "1.5rem 1.5rem 1rem 1.5rem",
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    minWidth: 280,
    flex: 1,
    maxWidth: 320,
  },
  chartTitle: {
    textAlign: "center",
    marginBottom: 12,
    color: "#334155",
    fontWeight: 600,
  },
};

export default TaskReportPage;
