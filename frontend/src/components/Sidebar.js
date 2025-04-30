import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Mood Tracker</h2>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/mood-entry">Mood Entry</Link></li>
        <li><Link to="/mood-history">Mood History</Link></li>
        <li><Link to="/mood-charts">Mood Charts</Link></li>
        <li><Link to="/generate-report">Generate Report</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;