import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MoodSelection.css';

const MoodSelection = ({ detectedMood, selectedEmoji }) => {
  const navigate = useNavigate();
  const [mood, setMood] = useState(detectedMood || 'neutral');
  const [emoji, setEmoji] = useState(selectedEmoji || '😐');
  const [energyLevel, setEnergyLevel] = useState('medium');

  useEffect(() => {
    if (detectedMood) {
      setMood(detectedMood);
      setEmoji(selectedEmoji);
    }
  }, [detectedMood, selectedEmoji]);

  const moodOptions = [
    { mood: 'happy', emoji: '😊' },
    { mood: 'sad', emoji: '😢' },
    { mood: 'angry', emoji: '😠' },
    { mood: 'neutral', emoji: '😐' },
    { mood: 'surprised', emoji: '😮' }
  ];

  const energyOptions = [
    { level: 'low', label: 'Low Energy' },
    { level: 'medium', label: 'Medium Energy' },
    { level: 'high', label: 'High Energy' }
  ];

  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/moods', {
        mood,
        detectedMood,
        emoji,
        energyLevel
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving mood:', error);
      alert('Failed to save mood. Please try again.');
    }
  };

  return (
    <div className="mood-selection">
      <h2>How are you feeling?</h2>
      <div className="detected-mood">
        <p>Detected Mood: {detectedMood}</p>
        <div className="emoji-large">{selectedEmoji}</div>
      </div>

      <div className="mood-options">
        <h3>Adjust if needed:</h3>
        <div className="emoji-grid">
          {moodOptions.map(option => (
            <div
              key={option.mood}
              className={`emoji-option ${mood === option.mood ? 'selected' : ''}`}
              onClick={() => {
                setMood(option.mood);
                setEmoji(option.emoji);
              }}
            >
              <span className="emoji">{option.emoji}</span>
              <span className="mood-label">{option.mood}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="energy-selection">
        <h3>Energy Level:</h3>
        <div className="energy-options">
          {energyOptions.map(option => (
            <button
              key={option.level}
              className={`energy-btn ${energyLevel === option.level ? 'selected' : ''}`}
              onClick={() => setEnergyLevel(option.level)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <button className="confirm-btn" onClick={handleConfirm}>
        Confirm
      </button>
    </div>
  );
};

export default MoodSelection;
