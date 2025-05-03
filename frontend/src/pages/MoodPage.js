import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MoodDetection from '../components/MoodDetection';
import axios from 'axios';
import './MoodPage.css';

const MoodPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('detection');
  const [detectedMood, setDetectedMood] = useState(null);
  const [selectedMood, setSelectedMood] = useState('');
  const [energyLevel, setEnergyLevel] = useState('');
  const [error, setError] = useState(null);

  const moodOptions = [
    { value: 'happy', label: 'Happy', emoji: '😊' },
    { value: 'sad', label: 'Sad', emoji: '😢' },
    { value: 'angry', label: 'Angry', emoji: '😠' },
    { value: 'neutral', label: 'Neutral', emoji: '😐' },
    { value: 'surprised', label: 'Surprised', emoji: '😮' }
  ];

  const energyOptions = [
    'Very Low',
    'Low',
    'Moderate',
    'High',
    'Very High'
  ];

  const handleMoodDetected = (detectedData) => {
    setDetectedMood(detectedData);
    setStep('selection');
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      await axios.post('http://localhost:5000/api/moods', {
        mood: selectedMood,
        detectedMood: detectedMood.detectedMood,
        emoji: detectedMood.emoji,
        energyLevel
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving mood:', error);
      setError(error.response?.data?.error || error.message || 'Failed to save mood. Please try again.');
    }
  };

  return (
    <div className="mood-page">
      {step === 'detection' ? (
        <MoodDetection onMoodConfirm={handleMoodDetected} />
      ) : (
        <div className="mood-selection">
          <h2>How are you feeling?</h2>
          <div className="detected-mood">
            <p>AI detected mood: {detectedMood.detectedMood}</p>
            <div className="emoji">{detectedMood.emoji}</div>
          </div>
          
          <div className="mood-options">
            <h3>Select your mood:</h3>
            <div className="mood-buttons">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  className={`mood-button ${selectedMood === mood.value ? 'selected' : ''}`}
                  onClick={() => setSelectedMood(mood.value)}
                >
                  <span>{mood.emoji}</span>
                  <span>{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="energy-selection">
            <h3>Energy Level:</h3>
            <div className="energy-buttons">
              {energyOptions.map((level) => (
                <button
                  key={level}
                  className={`energy-button ${energyLevel === level ? 'selected' : ''}`}
                  onClick={() => setEnergyLevel(level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <button 
            className="submit-button"
            onClick={handleSubmit}
            disabled={!selectedMood || !energyLevel}
          >
            Submit
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default MoodPage;
