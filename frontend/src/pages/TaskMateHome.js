import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MoodDetectionModal from "../components/MoodDetectionModal";
import WebcamPermissionModal from "./WebcamPermissionModal.js";
import "./TaskMateHome.css";

const TaskMateHome = () => {
  const [showWebcamModal, setShowWebcamModal] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // First, show webcam permission request
    setShowWebcamModal(true);
  };

  const handleWebcamPermission = async (granted) => {
    setShowWebcamModal(false);
    if (granted) {
      // If permission granted, show mood detection modal
      setShowMoodModal(true);
    } else {
      // If denied, go directly to manual mood selection
      navigate("/moodselection");
    }
  };

  const handleMoodConfirm = (moodData) => {
    // When mood is detected and confirmed, navigate to mood selection with the detected mood
    navigate("/moodselection", { state: { detectedMood: moodData } });
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>TaskMate</h1>
        <div className="auth-buttons">
          <button className="login-btn">Login</button>
        </div>
      </header>

      <main className="home-main">
        <h1>Welcome To TaskMate</h1>
        <p>A simple to-do list to manage it all</p>
        <button className="get-started-btn" onClick={handleGetStarted}>
          Get Started
        </button>
      </main>

      {/* Webcam Permission Modal */}
      {showWebcamModal && (
        <WebcamPermissionModal
          onYes={() => handleWebcamPermission(true)}
          onNo={() => handleWebcamPermission(false)}
          onClose={() => setShowWebcamModal(false)}
        />
      )}

      {/* Mood Detection Modal */}
      <MoodDetectionModal
        isOpen={showMoodModal}
        onClose={() => setShowMoodModal(false)}
        onMoodConfirm={handleMoodConfirm}
      />
    </div>
  );
};

export default TaskMateHome;