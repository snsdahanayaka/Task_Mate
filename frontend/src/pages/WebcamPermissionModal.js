import React from 'react';
import { useNavigate } from 'react-router-dom';

const WebcamPermissionModal = ({ onYes, onClose }) => {
  const navigate = useNavigate();

  const handleYesClick = () => {
    navigate("/webcam-detection"); // or wherever you show webcam
    if (onYes) onYes(); // optional callback if parent wants to know
  };

  const handleNo = () => {
    navigate("/mood-selection");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          width: '80%',
          maxWidth: '400px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <button
          type="button"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '1.2em',
            cursor: 'pointer',
          }}
          onClick={onClose}
        >
          X
        </button>
        <p
          style={{
            marginBottom: '20px',
            color: 'black',
            fontSize: '16px',
            fontWeight: 'normal',
            opacity: 1,
          }}
        >
          Do you allow access to your webcam? This is necessary for mood detection.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <button
            type="button"
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1em',
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            onClick={handleYesClick}
          >
            YES
          </button>
          <button
            type="button"
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1em',
              backgroundColor: '#f44336',
              color: 'white',
            }}
            onClick={handleNo}
          >
            NO
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebcamPermissionModal;
