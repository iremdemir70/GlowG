import React, { useState } from 'react';
import './OptionsPanel.css';
import SkinTypeTestPopup from '../SkinTypePopup/SkinTypeTestPopup';

const OptionsPanel = ({ isLoggedIn, goToQuiz, goToRightForMe, goToSuggest, setShowPopup }) => {
  const [showLoginWarning, setShowLoginWarning] = useState(false);

  const handleQuizClick = () => {
    if (!isLoggedIn) {
      setShowLoginWarning(true);
      setTimeout(() => setShowLoginWarning(false), 5000);
    } else {
      goToQuiz();
    }
  };

  const handleRightForMeClick = () => {
    if (!isLoggedIn) {
      setShowPopup(true); // 👈 sadece bu butona basınca görünür
    } else {
      goToRightForMe();
    }
  };

  const handleSuggestClick = () => {
    if (!isLoggedIn) {
      setShowPopup(true); // 👈 sadece bu butona basınca görünür
    } else {
      goToSuggest();
    }
  };

  return (
    <section className="options">
      <button className="option-btn" onClick={handleQuizClick}>
        Learn Your Skin Type
      </button>

      {showLoginWarning && (
        <p style={{ color: 'red', fontSize: 14, marginTop: 5 }}>
          To continue, please log in.
        </p>
      )}

      <button className="option-btn" onClick={handleRightForMeClick}>
        Is This Skin Care Product Right for Me?
      </button>

      <button className="option-btn" onClick={handleSuggestClick}>
        Suggest Skin Care Products for Me
      </button>
    </section>
  );
};


export default OptionsPanel;
