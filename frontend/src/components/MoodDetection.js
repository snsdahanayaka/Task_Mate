import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import * as faceapi from 'face-api.js';
import './MoodDetection.css';

const MoodDetection = ({ onMoodConfirm }) => {
  const [hasWebcamPermission, setHasWebcamPermission] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedMood, setDetectedMood] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState('');
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
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models')
      ]);
    };
    loadModels();
  }, []);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setHasWebcamPermission(true);
    } catch (error) {
      console.error('Error accessing webcam:', error);
      alert('Unable to access webcam. Please grant permission and try again.');
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setHasWebcamPermission(false);
    }
  };

  const detectMood = async () => {
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
      }
    } catch (error) {
      console.error('Error detecting mood:', error);
      alert('Error detecting mood. Please try again.');
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

  return (
    <div className="mood-detection">
      {!hasWebcamPermission ? (
        <div className="permission-request">
          <h2>Webcam Access Required</h2>
          <p>We need access to your webcam to detect your mood.</p>
          <button onClick={startWebcam}>Allow Webcam Access</button>
        </div>
      ) : (
        <div className="detection-container">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="webcam-feed"
          />
          <div className="controls">
            <button 
              onClick={detectMood} 
              disabled={isDetecting}
            >
              {isDetecting ? 'Detecting...' : 'Detect Mood'}
            </button>
            {detectedMood && (
              <div className="mood-result">
                <p>Detected Mood: {detectedMood}</p>
                <div className="emoji">{selectedEmoji}</div>
                <button onClick={handleConfirm}>Confirm</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodDetection;
