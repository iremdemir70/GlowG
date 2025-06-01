import React from 'react';

const SkinTypePopup = ({ isOpen, onClose, skinType }) => {
  if (!isOpen) return null;

  const popupStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const contentStyle = {
    background: 'white',
    padding: '2rem',
    borderRadius: '16px',
    textAlign: 'center',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 0 20px rgba(0,0,0,0.2)',
    border: '3px solid #6a1b9a'
  };

  const buttonStyle = {
    marginTop: '1.5rem',
    padding: '0.6rem 1.5rem',
    backgroundColor: '#6a1b9a',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: '0.3s ease'
  };

  return (
    <div style={popupStyle}>
      <div style={contentStyle}>
        <h3>Your Skin Type</h3>
                <p className="popup-result">{skinType}</p>
        <button style={buttonStyle} onClick={onClose}>
          ✕ Close
        </button>
      </div>
    </div>
  );
};

export default SkinTypePopup;
