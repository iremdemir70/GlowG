import React, { useState } from "react";
import "./SkinTypeTest.css";
const baseUrl = "http://localhost:5000"; // bu doğru


function SkinTypeTest() {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [showError, setShowError] = useState(false);

  const totalQuestions = 8;

  const handleChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(answers).length < totalQuestions) {
      setShowError(true);
      setShowResult(false);
    } else {
      setShowError(false);
      setShowResult(true);
    }
  };

  return (
    <div className="container">
      <div className="top-bar">
        <h2 className="logo">Glow Genie</h2>
        <button className="btn" onClick={() => window.location.href = "/"}>
          <i className="fa fa-home"></i>
        </button>
      </div>

      <p className="instruction"><strong>Discover Your Skin Type</strong></p>
      <p className="sub-instruction">
        Answer a few questions to find out which skin type matches you best.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="questions-container">
          {Array.from({ length: totalQuestions }, (_, i) => {
            const qNumber = i + 1;
            const questionText = getQuestionText(qNumber);
            const options = getQuestionOptions(qNumber);
            return (
              <div key={qNumber} className="question">
                <label>{`${qNumber}. ${questionText}`}</label>
                <div className="options">
                  {options.map((opt, idx) => (
                    <label key={idx}>
                      <input
                        type="radio"
                        name={`q${qNumber}`}
                        value={opt}
                        checked={answers[`q${qNumber}`] === opt}
                        onChange={handleChange}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <button type="submit" className="submit-btn">Submit</button>

        {showError && (
          <p className="error-message">Please fill in the mandatory areas.</p>
        )}

        {showResult && (
          <p className="result">
            Your skin type is... <span>[Calculated Type]</span>
          </p>
        )}
      </form>
    </div>
  );
}

function getQuestionText(num) {
  const questions = {
    1: "How often does your skin feel oily or shiny, especially in the T-zone (forehead, nose, and chin)?",
    2: "Does your skin feel tight, dry, or flaky after cleansing?",
    3: "How do moisturizers make your skin feel?",
    4: "Do you often experience blackheads or acne, especially in your T-zone?",
    5: "How does your skin feel after waking up in the morning?",
    6: "How does your skin react to seasonal changes?",
    7: "Does your skin feel comfortable and balanced throughout the day?",
    8: "How does your U-zone (cheeks and jawline) typically feel?"
  };
  return questions[num];
}

function getQuestionOptions(num) {
  const options = {
    1: ["Always", "Rarely", "Sometimes", "Frequently"],
    2: ["Always", "Often", "Occasionally", "Never"],
    3: ["Feel perfectly hydrated", "Feel greasy and sticky", "Feel slightly oily in some areas but fine in others", "Absorb quickly without feeling greasy"],
    4: ["Always", "Frequently", "Occasionally", "Never"],
    5: ["Feels perfectly balanced", "Feels dry or tight", "Feels normal in some areas but oily in the T-zone", "Feels greasy or shiny all over"],
    6: ["No noticeable change", "Feels drier in winter, normal in summer", "Feels normal in winter, oily in summer", "Feels oily or greasy regardless of season"],
    7: ["Always", "Occasionally", "Rarely", "Never"],
    8: ["Very oily throughout the day", "Slightly oily by the end of the day", "Normal, neither oily nor dry", "Dry or tight most of the time"]
  };
  return options[num];
}

export default SkinTypeTest;
