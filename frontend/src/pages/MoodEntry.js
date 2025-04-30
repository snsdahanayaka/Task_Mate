import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import './MoodEntry.css';

const MoodEntry = () => {
  // State variables for the form fields
  const [mood, setMood] = useState('');
  const [rating, setRating] = useState(5);
  const [description, setDescription] = useState('');
  const [weatherCondition, setWeatherCondition] = useState('Sunny');
  const [emotionTriggers, setEmotionTriggers] = useState([]);
  const [sleepQuality, setSleepQuality] = useState(false);
  const [error, setError] = useState(''); // For error handling
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate mood selection
    if (!mood) {
      setError('Please select a mood.');
      return;
    }

    // Prepare the mood entry object
    const entry = {
      mood,
      rating: parseInt(rating, 10), // Ensure rating is a number
      description,
      weatherCondition,
      emotionTriggers,
      sleepQuality,
    };

    try {
      // Send the mood entry to the backend
      const response = await axios.post('http://localhost:5000/api/mood/entries', entry);
      if (response.status === 201) {
        alert('Mood entry saved successfully!');
        // Reset the form after successful submission
        setMood('');
        setRating(5);
        setDescription('');
        setWeatherCondition('Sunny');
        setEmotionTriggers([]);
        setSleepQuality(false);
        setError('');
      }
    } catch (err) {
      console.error('Error saving mood entry:', err);
      setError('Failed to save mood entry. Please try again.');
    }
  };

  return (
    <div className="mood-entry-container">
      <Sidebar />
      <div className="mood-entry-content">
        <h1>How are you feeling today?</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="mood-entry-form">
          {/* Mood Selection */}
          <div className="form-group">
            <label>Mood</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              required
            >
              <option value="">Select Mood</option>
              <option value="Happy">Happy 😊</option>
              <option value="Sad">Sad 😢</option>
              <option value="Stressed">Stressed 😖</option>
              <option value="Angry">Angry 😠</option>
            </select>
          </div>

          {/* Mood Rating */}
          <div className="form-group">
            <label>Rating (1-10)</label>
            <input
              type="number"
              min="1"
              max="10"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength="500"
              placeholder="What's on your mind?"
            />
          </div>

          {/* Weather Condition */}
          <div className="form-group">
            <label>Weather Condition</label>
            <select
              value={weatherCondition}
              onChange={(e) => setWeatherCondition(e.target.value)}
            >
              <option value="Sunny">Sunny ☀️</option>
              <option value="Rainy">Rainy 🌧️</option>
              <option value="Cloudy">Cloudy ☁️</option>
              <option value="Windy">Windy 🌬️</option>
            </select>
          </div>

          {/* Emotion Triggers */}
          <div className="form-group">
            <label>Emotion Triggers</label>
            {['Work', 'Family', 'Friends', 'Social Media', 'Personal Reflection'].map((trigger) => (
              <label key={trigger} className="checkbox-label">
                <input
                  type="checkbox"
                  value={trigger}
                  checked={emotionTriggers.includes(trigger)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setEmotionTriggers([...emotionTriggers, trigger]);
                    } else {
                      setEmotionTriggers(emotionTriggers.filter((t) => t !== trigger));
                    }
                  }}
                />
                {trigger}
              </label>
            ))}
          </div>

          {/* Sleep Quality */}
          <div className="form-group">
            <label>Sleep Quality</label>
            <select
              value={sleepQuality}
              onChange={(e) => setSleepQuality(e.target.value === 'true')}
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>

          {/* Buttons Container */}
          <div className="buttons-container">
            <button type="submit" className="save-button">
              Save
            </button>
            <button
              onClick={() => navigate('/mood-history')}
              className="view-history-button"
            >
              View Mood History
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MoodEntry;