import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Sidebar />
      <div className="home-content">
        <h1>Track Your Mood, Understand Yourself Better</h1>
        <p>Start your journey to emotional well-being today.</p>
        <button onClick={() => navigate('/mood-entry')} className="get-started-btn">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;