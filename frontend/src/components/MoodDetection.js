import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import * as faceapi from 'face-api.js';
import './MoodDetection.css';

const MoodDetection = ({ onMoodConfirm }) => {
  const [hasWebcamPermission, setHasWebcamPermission] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedMood, setDetectedMood] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef();
  const streamRef = useRef();

  const moodEmojis = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    neutral: '😐',
    surprised: '😮'
  };

  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]);
        // After models are loaded, try to start webcam
        await startWebcam();
      } catch (err) {
        console.error('Error loading models:', err);
        setError('Error loading face detection models. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    loadModels();

    // Cleanup function
    return () => {
      stopWebcam();
    };
  }, []);

  const startWebcam = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: 640,
          height: 480,
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setHasWebcamPermission(true);
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      if (error.name === 'NotAllowedError') {
        setError('Webcam access denied. Please allow camera access in your browser settings and refresh the page.');
      } else if (error.name === 'NotFoundError') {
        setError('No webcam found. Please connect a webcam and try again.');
      } else {
        setError('Unable to access webcam. Please check your camera settings and try again.');
      }
      setHasWebcamPermission(false);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setHasWebcamPermission(false);
    }
  };

  const retryWebcam = async () => {
    await startWebcam();
  };

  const detectMood = async () => {
    if (!videoRef.current || !hasWebcamPermission) {
      setError('Please grant webcam access first');
      return;
    }

    setIsDetecting(true);
    try {
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections) {
        const expressions = detections.expressions;
        const mood = Object.keys(expressions).reduce((a, b) => 
          expressions[a] > expressions[b] ? a : b
        );
        setDetectedMood(mood);
        setSelectedEmoji(moodEmojis[mood] || '😐');
        setError(null);
      } else {
        setError('No face detected. Please make sure your face is visible in the camera.');
      }
    } catch (error) {
      console.error('Error detecting mood:', error);
      setError('Error detecting mood. Please try again.');
    }
    setIsDetecting(false);
  };

  const handleConfirm = () => {
    if (detectedMood) {
      onMoodConfirm({
        detectedMood,
        emoji: selectedEmoji
      });
      stopWebcam();
    }
  };

  if (isLoading) {
    return (
      <div className="mood-detection loading">
        <div className="loading-spinner"></div>
        <p>Loading face detection models...</p>
      </div>
    );
  }

  return (
    <div className="mood-detection">
      {error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={retryWebcam}>
            Try Again
          </button>
        </div>
      ) : (
        <div className="detection-container">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="webcam-feed"
            onPlay={() => setHasWebcamPermission(true)}
          />
          <div className="controls">
            {hasWebcamPermission ? (
              <>
                <button 
                  onClick={detectMood} 
                  disabled={isDetecting}
                  className="detect-button"
                >
                  {isDetecting ? 'Detecting...' : 'Detect Mood'}
                </button>
                {detectedMood && (
                  <div className="mood-result">
                    <p>Detected Mood: {detectedMood}</p>
                    <div className="emoji">{selectedEmoji}</div>
                    <button onClick={handleConfirm} className="confirm-button">
                      Confirm
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button onClick={startWebcam} className="start-button">
                Start Camera
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodDetection;
