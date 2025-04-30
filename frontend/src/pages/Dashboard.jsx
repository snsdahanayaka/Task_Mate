import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegBell, FaCalendarAlt } from "react-icons/fa";
import "../styles/dashboard.css";
import ChatbotAnimation from "../components/ChatbotAnimation";
import axios from 'axios';
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
  happy: "Keep smiling and spread your positivity! 💛",
  sad: "It's okay to have tough days. You're stronger than you think! 💙",
  angry: "Take a deep breath. You've got this! 🔥",
  neutral: "Stay balanced and mindful! 🌟",
  surprised: "Embrace the unexpected moments! ✨"
};

const moodEmojis = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  neutral: "😐",
  surprised: "😮"
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [mood, setMood] = useState("neutral");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchLatestMood = async () => {
      try {
        setError(null);
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        const response = await axios.get('http://localhost:5000/api/moods/latest', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data) {
          const moodData = response.data;
          setMood(moodData.detectedMood?.toLowerCase() || moodData.mood?.toLowerCase() || 'neutral');
        }

        // Get user info (you'll need to implement this endpoint)
        const userResponse = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (userResponse.data) {
          setUserName(userResponse.data.name || 'User');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.error || err.message || 'Failed to fetch data');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLatestMood();
  }, [navigate]);

  const data = [
    { name: "May", tasks: 100 },
    { name: "Jun", tasks: 200 },
    { name: "Jul", tasks: 300 },
    { name: "Aug", tasks: 400 },
    { name: "Sep", tasks: 250 },
    { name: "Oct", tasks: 320 },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>TaskMate</h2>
        <ul>
          <li className="active"><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/tasks">Tasks</Link></li>
          <li><Link to="/mood">Mood</Link></li>
          <li><Link to="/chatbot">Chatbot</Link></li>
          <li><Link to="/calendar">Calendar</Link></li>
          <li><Link to="/notifications">Remainder</Link></li>
          <li><Link to="/settings">Settings</Link></li>
        </ul>
      </div>

      <div className="dashboard-content">
        <header>
          <h2>Welcome{userName ? `, ${userName}` : ''}! 👋</h2>
          <input
            type="text"
            placeholder="Search anything..."
            className="search-bar"
          />
        </header>

        {error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        ) : (
          <div className="dashboard-sections">
            <div className="mood-section">
              <p>{moodMessages[mood] || "Hope you have a great day! 😊"}</p>
              <div className="mood-box">
                <span>{moodEmojis[mood] || "🙂"}</span>
                <p>Current Mood: {mood.charAt(0).toUpperCase() + mood.slice(1)}</p>
              </div>
            </div>

            <div className="task-section">
              <h3>Today's Tasks</h3>
              <p>Check your daily tasks and schedules</p>
              <button>View Schedule</button>
            </div>

            <div className="chart-section">
              <h3>Task Progress</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="tasks"
                    stroke="#6c63ff"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      <div className="chatbot-wrapper">
        <ChatbotAnimation />
      </div>
    </div>
  );
};

export default Dashboard;