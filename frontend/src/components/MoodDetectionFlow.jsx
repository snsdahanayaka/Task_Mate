// src/pages/MoodDetectionFlow.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MoodDetector from '../components/MoodDetector';
import axios from 'axios';

const Container = styled.div`
  text-align: center;
  margin: 2rem auto;
  max-width: 800px;
  padding: 20px;
`;

const PermissionPrompt = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  margin: 2rem auto;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  text-align: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 0 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  
  &.primary {
    background-color: #4CAF50;
    color: white;
  }
  
  &.secondary {
    background-color: #9ca3af;
    color: white;
  }
`;

const DetectedMood = styled.div`
  margin: 20px 0;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const moodEmojis = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  surprised: "😮",
  fearful: "😨",
  disgusted: "🤢",
  neutral: "😐"
};

const energyWords = {
  happy: "You're radiating positivity! Let's channel this energy!",
  sad: "It's okay to feel down. We're here to help lift your spirits!",
  angry: "Take a deep breath. Let's transform this energy into productivity!",
  surprised: "What an energetic state! Let's make the most of it!",
  fearful: "You're stronger than you think. Let's face this together!",
  disgusted: "Let's clear your mind and focus on what makes you feel better!",
  neutral: "A balanced state of mind - perfect for tackling any task!"
};

const MoodDetectionFlow = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [detectedMood, setDetectedMood] = useState(null);
  const navigate = useNavigate();

  const handlePermissionResponse = (allowed) => {
    if (allowed) {
      setShowCamera(true);
    } else {
      navigate('/mood-selection');
    }
  };

  const handleMoodDetected = (mood) => {
    // Normalize mood to capitalize first letter
    const normalizedMood = mood.charAt(0).toUpperCase() + mood.slice(1).toLowerCase();
    setDetectedMood(normalizedMood);
  };

  const handleConfirm = async () => {
    if (detectedMood) {
      try {
        // Normalize mood to capitalize first letter
        const normalizedMood = detectedMood.charAt(0).toUpperCase() + detectedMood.slice(1).toLowerCase();
        await axios.post('http://localhost:5000/api/moods', { mood: normalizedMood });
        localStorage.setItem('selectedMood', normalizedMood);
        localStorage.setItem('moodEnergy', energyWords[detectedMood]);
        navigate('/mood-selection');
      } catch (error) {
        console.error('Failed to save mood:', error);
        navigate('/mood-selection'); // still navigate even on failure
      }
    }
  };

  return (
    <Container>
      {!showCamera ? (
        <PermissionPrompt>
          <h2>Camera Permission Required</h2>
          <p>We need access to your camera to detect your mood. Would you like to proceed?</p>
          <Button className="primary" onClick={() => handlePermissionResponse(true)}>Yes</Button>
          <Button className="secondary" onClick={() => handlePermissionResponse(false)}>No</Button>
        </PermissionPrompt>
      ) : (
        <>
          <MoodDetector onMoodChange={handleMoodDetected} />
          {detectedMood && (
            <>
              <DetectedMood>
                <span>Detected Mood: {detectedMood}</span>
              </DetectedMood>
              {/* Show matching emoji below detected mood */}
              <div style={{ fontSize: '3rem', margin: '10px 0' }}>
                {moodEmojis[detectedMood]}
              </div>
              <p>{energyWords[detectedMood]}</p>
              <Button className="primary" onClick={handleConfirm}>Confirm</Button>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default MoodDetectionFlow;
