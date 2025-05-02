import React from 'react';
import './Popup.css';

const SkinTypePopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>Your Skin Type</h3>
        <p>Details go here...</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SkinTypePopup;