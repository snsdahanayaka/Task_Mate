import React from 'react';
import MoodDetection from './MoodDetection';
import './MoodDetectionModal.css';

const MoodDetectionModal = ({ isOpen, onClose, onMoodConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <MoodDetection onMoodConfirm={(moodData) => {
          onMoodConfirm(moodData);
          onClose();
        }} />
      </div>
    </div>
  );
};

export default MoodDetectionModal;
