import React from 'react';
import './SkinTypeTestPopup.css';

const SkinTypePopup = ({ goToHomePage, goToQuiz, onClose }) => {
  return (
    <div id="skinTypePopup" className="skin-type-popup">
      {/* Çarpı butonu */}
      <button 
        className="skin-type-popup-close-btn" 
        onClick={onClose} 
        aria-label="Close Popup"
      >
        ×
      </button>

      <p className="skin-type-popup-description">
        To proceed further, we need to know your skin type.<br />
        Do you know your skin type? If yes, please update it from your profile.<br />
        If not, you can solve our quiz.
      </p>
      <div className="skin-type-popup-buttons">
        <div className="skin-type-popup-btn-container">
          <p>Click the button below to go to Home Page to update your skin type.</p>
          <button onClick={goToHomePage}>Return to Home Page</button>
        </div>
        <div className="skin-type-popup-btn-container">
          <p>Click the button below and take the quiz to find out your skin type.</p>
          <button onClick={goToQuiz}>Solve the Quiz</button>
        </div>
      </div>
    </div>
  );
};

export default SkinTypePopup;
