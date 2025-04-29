import React from 'react';

const WebcamPermissionModal = ({ onYes, onNo, onClose }) => {
  return (
    <div
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
            color: 'black', // Explicitly set text color to black
            fontSize: '16px', // Explicitly set font size
            fontWeight: 'normal', // Explicitly set font weight
            opacity: 1, // Explicitly set opacity
          }}
        >
          Do you like on your webcam to capture your face to mood tracking?
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <button
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1em',
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            onClick={onYes}
          >
            YES
          </button>
          <button
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1em',
              backgroundColor: '#f44336',
              color: 'white',
            }}
            onClick={onNo}
          >
            NO
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebcamPermissionModal;