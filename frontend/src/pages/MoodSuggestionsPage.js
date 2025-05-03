import React, { useState } from "react";
import MoodDetector from "../components/MoodDetector";

// Simple mood-to-keywords mapping for semantic suggestion
const moodKeywords = {
  happy: ["enjoy", "celebrate", "fun", "reward", "smile"],
  sad: ["easy", "uplifting", "break", "relax", "comfort"],
  angry: ["calm", "breathe", "organize", "relax", "meditate"],
  surprised: ["explore", "new", "creative", "discover", "learn"],
  fearful: ["familiar", "easy", "routine", "confidence", "safe"],
  disgusted: ["clean", "tidy", "organize", "refresh", "reset"],
  neutral: ["any", "choose", "pick", "task", "start"],
};

const MoodSuggestionsPage = () => {
  const [detectedMood, setDetectedMood] = useState(null);

  const handleMoodChange = (mood) => {
    setDetectedMood(mood);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Mood Suggestions</h1>
      <MoodDetector onMoodChange={handleMoodChange} />
      
      {detectedMood && (
        <div style={styles.suggestionsBox}>
          <h2 style={styles.subtitle}>Suggestions for {detectedMood}</h2>
          <ul style={styles.taskList}>
            {moodKeywords[detectedMood]?.map((task, index) => (
              <li key={index} style={styles.taskItem}>
                <span>{task}</span>
              </li>
            ))}

            {!moodKeywords[detectedMood] && (
              <li style={styles.noTask}>No suggestions available for this mood</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "linear-gradient(90deg, #e0e7ff 0%, #a5b4fc 100%)",
    padding: "2rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 700,
    marginBottom: "1.5rem",
    color: "#333",
  },
  subtitle: {
    fontSize: "1.2rem",
    fontWeight: 600,
    marginBottom: "1rem",
    color: "#4f46e5",
  },
  suggestionsBox: {
    background: "#fff",
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    padding: "2rem",
    maxWidth: 600,
    width: "100%",
  },
  taskList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  taskItem: {
    padding: "1rem 0",
    borderBottom: "1px solid #eee",
  },
  noTask: {
    color: "#888",
    fontStyle: "italic",
  },
};

export default MoodSuggestionsPage;
