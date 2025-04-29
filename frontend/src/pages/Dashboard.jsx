import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaRegBell, FaCalendarAlt } from "react-icons/fa";
import "../styles/dashboard.css";
import ChatbotAnimation from "../components/ChatbotAnimation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const moodMessages = {
  Happy: "Keep smiling and spread your positivity! 💛",
  Sad: "It's okay to have tough days. You’re stronger than you think! 💙",
  Angry: "Take a deep breath. You’ve got this! 🔥",
  Stress: "Relax, one step at a time. You are capable of handling it! 🌿",
};

const moodEmojis = {
  Happy: "😊",
  Sad: "😢",
  Angry: "😠-",
  Stress: "😓",
};

const Dashboard = () => {
  const [mood, setMood] = useState("Neutral");

  useEffect(() => {
    const storedMood = localStorage.getItem("selectedMood");
    if (storedMood) {
      setMood(storedMood);
    }
  }, []);

  const data = [
    { name: "May", tasks: 100 },
    { name: "Jun", tasks: 200 },
    { name: "Jul", tasks: 300 },
    { name: "Aug", tasks: 400 },
    { name: "Sep", tasks: 250 },
    { name: "Oct", tasks: 320 },
  ];

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Base</h2>
        <ul>
          <li className="active"><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/tasks">Tasks</Link></li>
          <li><Link to="/analytics">Mood</Link></li>
          <li><Link to="/chatbot">Chatbot</Link></li> {/* Corrected Link */}
          <li><Link to="/calendar">Calendar</Link></li>
          <li><Link to="/notifications">Remainder</Link></li>
          <li><Link to="/settings">Settings</Link></li>
        </ul>
      </div>

      <div className="dashboard-content">
        <header>
          <h2>Welcome to TaskMate!</h2>
          <input
            type="text"
            placeholder="Search anything..."
            className="search-bar"
          />
        </header>

        <div className="mood-section">
          <p>Sandali, {moodMessages[mood] || "Hope you have a great day! 😊"}</p>
          <div className="mood-box">
            <span>{moodEmojis[mood] || "🙂"}</span>
            <p>Mood: {mood || "Neutral"}</p>
          </div>
        </div>

        <div className="task-section">
          <h3>Today's Task</h3>
          <p>Check your daily tasks and schedules</p>
          <button>Today's schedule</button>
        </div>

        <div className="chart-section">
          <h3>Task Done</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="tasks"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chatbot-wrapper">
        <ChatbotAnimation />
      </div>
    </div>
  );
};

export default Dashboard;