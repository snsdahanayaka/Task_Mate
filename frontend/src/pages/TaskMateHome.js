import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import WebcamPermissionModal from "./WebcamPermissionModal.js"; // Import the modal

const TaskMateHome = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleGetStarted = () => {
    setShowModal(true);
  };

  const handleYes = () => {
    console.log("Webcam access granted.");
    setShowModal(false);
    navigate("/mood-detection");
  };

  const handleNo = () => {
    // Logic to proceed without webcam access
    console.log("Webcam access denied.");
    setShowModal(false);
    navigate("/mood-selection"); // ✅ Fixed path (was "/moodselection")
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(to bottom, #9370DB, #6A5ACD)",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <header
        style={{
          position: "absolute",
          top: "20px",
          left: "30px",
          fontSize: "1.8rem",
          fontWeight: "bold",
        }}
      >
        TaskMate
      </header>
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "30px",
          display: "flex",
          gap: "15px",
        }}
      >
        <button
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
            border: "none",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            backgroundColor: "white",
            color: "#333",
          }}
        >
          Login
        </button>
      </div>
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            marginBottom: "15px",
          }}
        >
          Welcome To TaskMate
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            marginBottom: "30px",
          }}
        >
          A simple to-do list to manage it all
        </p>
        <button
          style={{
            padding: "12px 25px",
            backgroundColor: "black",
            color: "white",
            borderRadius: "25px",
            fontSize: "1.1rem",
            cursor: "pointer",
            border: "none",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
          }}
          onClick={handleGetStarted}
        >
          Get Started
        </button>
      </div>

      {showModal && (
        <WebcamPermissionModal
          onYes={handleYes}
          onNo={handleNo}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default TaskMateHome;
