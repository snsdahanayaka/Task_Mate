import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MoodNotification from './MoodNotification'; // Import MoodNotification
import '../styles/Signup.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [error, setError] = useState('');
  const [showMoodNotification, setShowMoodNotification] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!recaptchaVerified) {
      setError('Please verify that you are not a robot.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users/signup', {
        username,
        email,
        password,
      });

      console.log('Signup successful:', response.data);
      setShowMoodNotification(true); // Show modal after signup
    } catch (err) {
      console.error('Signup failed:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  const handleMoodNotificationClose = (navigateTo) => {
    setShowMoodNotification(false);
    navigate(navigateTo);
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Create an account</h2>
        <p>
          Already have an account? <a href="/login">Log in</a>
        </p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="User name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-input">
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? 'Hide' : 'Show'}
            </button>
          </div>
          <p className="password-requirements">
            Use 8 or more characters with a mix of letters, numbers & symbols
          </p>
          <p className="terms-privacy">
            By creating an account, you agree to our{' '}
            <a href="/terms">Terms of use</a> and{' '}
            <a href="/privacy">Privacy Policy</a>
          </p>

          <div className="recaptcha">
            {/* Replace with your actual reCAPTCHA implementation */}
            <label>
              <input
                type="checkbox"
                onChange={(e) => setRecaptchaVerified(e.target.checked)}
              />
              I'm not a robot
            </label>
            {/* Add reCAPTCHA widget here if you're using a specific library */}
          </div>

          <button type="submit" className="signup-button">
            Create an account
          </button>
        </form>

        <p>
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>

      {showMoodNotification && (
        <MoodNotification onClose={handleMoodNotificationClose} />
      )}
    </div>
  );
};

export default Signup;