import React, { useState } from "react";
import "./SkinTypeTest.css";
import { useNavigate } from "react-router-dom";

const typeIdToName = {
  0: "Combination Skin",
  1: "Dry Skin",
  2: "Normal Skin",
  3: "Oily Skin",
  4: "Combination Skin"
};

function SkinTypeTest() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(Array(8).fill(""));
  const [error, setError] = useState(false);
  const [result, setResult] = useState(null);

  const letterMap = ["a", "b", "c", "d"];

  const questions = [
    {
      question: "How often does your skin feel oily or shiny, especially in the T-zone (forehead, nose, and chin)?",
      options: ["Always", "Rarely", "Sometimes", "Frequently"]
    },
    {
      question: "Does your skin feel tight, dry, or flaky after cleansing?",
      options: ["Always", "Often", "Occasionally", "Never"]
    },
    {
      question: "How do moisturizers make your skin feel?",
      options: [
        "Feel perfectly hydrated",
        "Feel greasy and sticky",
        "Feel slightly oily in some areas but fine in others",
        "Absorb quickly without feeling greasy"
      ]
    },
    {
      question: "Do you often experience blackheads or acne in your T-zone?",
      options: ["Always", "Frequently", "Occasionally", "Never"]
    },
    {
      question: "How does your skin feel after waking up in the morning?",
      options: [
        "Perfectly balanced",
        "Dry or tight",
        "Normal in some areas but oily in the T-zone",
        "Greasy or shiny all over"
      ]
    },
    {
      question: "How does your skin react to seasonal changes?",
      options: [
        "No noticeable change",
        "Drier in winter, normal in summer",
        "Normal in winter, oily in summer",
        "Oily regardless of season"
      ]
    },
    {
      question: "Does your skin feel balanced throughout the day?",
      options: ["Always", "Occasionally", "Rarely", "Never"]
    },
    {
      question: "How does your U-zone (cheeks/jawline) typically feel?",
      options: [
        "Very oily",
        "Slightly oily",
        "Normal, neither oily nor dry",
        "Dry or tight"
      ]
    }
  ];

  const handleAnswerChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (answers.every(a => a !== "")) {
      setError(false);

      const payload = {
        user_id: 20,
        Q1: letterMap[questions[0].options.indexOf(answers[0])],
        Q2: letterMap[questions[1].options.indexOf(answers[1])],
        Q3: letterMap[questions[2].options.indexOf(answers[2])],
        Q4: letterMap[questions[3].options.indexOf(answers[3])],
        Q5: letterMap[questions[4].options.indexOf(answers[4])],
        Q6: letterMap[questions[5].options.indexOf(answers[5])],
        Q7: letterMap[questions[6].options.indexOf(answers[6])],
        Q8: letterMap[questions[7].options.indexOf(answers[7])],
      };

      try {
        const response = await fetch("http://127.0.0.1:5000/predict-skintype", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (response.ok) {
          setResult(typeIdToName[data.prediction_code] || data.prediction);
        } else {
          setResult("Prediction failed: " + data.error);
        }
      } catch (err) {
        setResult("Error: " + err.message);
      }

    } else {
      setError(true);
      setResult(null);
    }
  };

  return (
    <div className="skin-test__container">
      {/* TOP BAR */}
      <div className="skin-test__top-bar">
        <h2 className="skin-test__logo">Glow Genie</h2>
        <button className="skin-test__home-btn" onClick={() => navigate("/home-page")}>
          <i className="fa fa-home"></i>
        </button>
      </div>

      {/* INSTRUCTIONS */}
      <p className="skin-test__instruction"><strong>Discover Your Skin Type</strong></p>
      <p className="skin-test__sub-instruction">Answer a few questions to find out which skin type matches you best.</p>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <div className="skin-test__questions-container">
          {questions.map((q, i) => (
            <div key={i} className="skin-test__question">
              <label>{`${i + 1}. ${q.question}`}</label>
              <div className="skin-test__options">
                {q.options.map((opt, idx) => (
                  <label key={idx}>
                    <input
                      type="radio"
                      name={`q${i + 1}`}
                      value={opt}
                      checked={answers[i] === opt}
                      onChange={() => handleAnswerChange(i, opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="skin-test__submit-btn">Submit</button>

        {error && (
          <p className="skin-test__error-message">Please fill in all questions.</p>
        )}
        {result && (
          <p className="skin-test__result">
            Your skin type is... <span>{result}</span>
          </p>
        )}
      </form>
    </div>
  );
}

export default SkinTypeTest;