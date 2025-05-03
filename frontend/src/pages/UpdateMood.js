import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import './UpdateMood.css';

const UpdateMood = () => {
  const { id } = useParams(); // Get the mood entry ID from the URL
  const navigate = useNavigate();
  const [moodEntry, setMoodEntry] = useState({
    mood: '',
    rating: 5,
    description: '',
    weatherCondition: 'Sunny',
    emotionTriggers: [],
    sleepQuality: false,
  });
  const [error, setError] = useState(''); // For error handling

  // Fetch mood entry data from the backend
  useEffect(() => {
    const fetchMoodEntry = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/mood/entries/${id}`);
        console.log('Fetched Mood Entry:', response.data); // Debugging
        setMoodEntry({
          mood: response.data.mood,
          rating: response.data.rating,
          description: response.data.description,
          weatherCondition: response.data.weatherCondition,
          emotionTriggers: response.data.emotionTriggers,
          sleepQuality: response.data.sleepQuality,
        });
      } catch (err) {
        console.error('Error fetching mood entry:', err);
        setError('Failed to fetch mood entry. Please try again.');
      }
    };
    fetchMoodEntry();
  }, [id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMoodEntry({
      ...moodEntry,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle emotion triggers changes
  const handleEmotionTriggersChange = (e) => {
    const { value, checked } = e.target;
    let updatedTriggers = [...moodEntry.emotionTriggers];
    if (checked) {
      updatedTriggers.push(value);
    } else {
      updatedTriggers = updatedTriggers.filter((trigger) => trigger !== value);
    }
    setMoodEntry({
      ...moodEntry,
      emotionTriggers: updatedTriggers,
    });
  };

  // Handle form submission (update mood entry)
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validate mood selection
    if (!moodEntry.mood) {
      setError('Please select a mood.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/mood/entries/${id}`, moodEntry);
      if (response.status === 200) {
        alert('Mood entry updated successfully!');
        navigate('/mood-history'); // Redirect to mood history page
      }
    } catch (err) {
      console.error('Error updating mood entry:', err);
      setError('Failed to update mood entry. Please try again.');
    }
  };

  // Handle delete mood entry
  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this mood entry?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/mood/entries/${id}`);
        alert('Mood entry deleted successfully!');
        navigate('/mood-history'); // Redirect to mood history page
      } catch (err) {
        console.error('Error deleting mood entry:', err);
        setError('Failed to delete mood entry. Please try again.');
      }
    }
  };

  return (
    <div className="update-mood-container">
      <Sidebar />
      <div className="update-mood-content">
        <h1>Update Mood Entry</h1>
        {error && <p className="error-message">{error}</p>}

        {/* Mood Face Circle */}
        <div className="mood-face-circle">
          {moodEntry.mood === 'Happy' && '😊'}
          {moodEntry.mood === 'Sad' && '😢'}
          {moodEntry.mood === 'Stressed' && '😖'}
          {moodEntry.mood === 'Angry' && '😠'}
        </div>

        {/* Mood Entry Form */}
        <form onSubmit={handleUpdate} className="update-mood-form">
          {/* Mood */}
          <div className="form-group">
            <label>Mood</label>
            <select
              name="mood"
              value={moodEntry.mood}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Mood</option>
              <option value="Happy">Happy 😊</option>
              <option value="Sad">Sad 😢</option>
              <option value="Stressed">Stressed 😖</option>
              <option value="Angry">Angry 😠</option>
            </select>
          </div>

          {/* Rating */}
          <div className="form-group">
            <label>Rating (1-10)</label>
            <input
              type="number"
              name="rating"
              min="1"
              max="10"
              value={moodEntry.rating}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={moodEntry.description}
              onChange={handleInputChange}
              maxLength="500"
              placeholder="What's on your mind?"
            />
          </div>

          {/* Weather Condition */}
          <div className="form-group">
            <label>Weather Condition</label>
            <select
              name="weatherCondition"
              value={moodEntry.weatherCondition}
              onChange={handleInputChange}
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
                  checked={moodEntry.emotionTriggers.includes(trigger)}
                  onChange={handleEmotionTriggersChange}
                />
                {trigger}
              </label>
            ))}
          </div>

          {/* Sleep Quality */}
          <div className="form-group">
            <label>Sleep Quality</label>
            <select
              name="sleepQuality"
              value={moodEntry.sleepQuality}
              onChange={handleInputChange}
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="buttons-container">
            <button type="submit" className="update-button">
              Update
            </button>
            <button type="button" onClick={handleDelete} className="delete-button">
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMood;