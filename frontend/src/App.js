import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import TaskMateHome from "./pages/TaskMateHome";
import ChatbotHome from "./pages/ChatbotHome";
import Dashboard from "./pages/Dashboard";
import MoodSelection from "./pages/MoodSelection";
import ReminderManagement from "./pages/ReminderManagement";
import ReminderList from "./pages/ReminderList";
import ReminderSummary from "./pages/ReminderSummary";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskMateHome />} />
        <Route path="/moodselection" element={<MoodSelection />} />{" "}
        {/* Corrected route */}
        <Route path="/chatbot" element={<ChatbotHome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/management" element={<ReminderManagement />} />
        <Route path="/summary" element={<ReminderSummary />} />
        <Route path="/list" element={<ReminderList />} />
       
      </Routes>
    </Router>
  );
}

export default App;