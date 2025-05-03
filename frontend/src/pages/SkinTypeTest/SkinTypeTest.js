import React, { useState } from 'react';
import './SkinTypeTest.css';

const typeIdToName = {
  0: "Unknown",
  1: "Dry Skin",
  2: "Normal Skin",
  3: "Oily Skin",
  4: "Combination Skin"
};


function SkinTypeTest() {
  const [answers, setAnswers] = useState(Array(8).fill("")); 
  const [error, setError] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnswerChange = (questionIndex, answer) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (answers.every(answer => answer !== "")) {
      setError(false);
  
      const letterMap = ['a', 'b', 'c', 'd'];
      const payload = {
        user_id: 20, // kullanıcıyı şimdilik elle girdim login hallolunca değişir.
        Q1: letterMap[answers[0].toLowerCase().charAt(0) === 'a' ? 0 : answers[0].toLowerCase().charAt(0)],
        Q2: letterMap[answers[1].toLowerCase().charAt(0) === 'a' ? 0 : answers[1].toLowerCase().charAt(0)],
        Q3: letterMap[answers[2].toLowerCase().charAt(0) === 'a' ? 0 : answers[2].toLowerCase().charAt(0)],
        Q4: letterMap[answers[3].toLowerCase().charAt(0) === 'a' ? 0 : answers[3].toLowerCase().charAt(0)],
        Q5: letterMap[answers[4].toLowerCase().charAt(0) === 'a' ? 0 : answers[4].toLowerCase().charAt(0)],
        Q6: letterMap[answers[5].toLowerCase().charAt(0) === 'a' ? 0 : answers[5].toLowerCase().charAt(0)],
        Q7: letterMap[answers[6].toLowerCase().charAt(0) === 'a' ? 0 : answers[6].toLowerCase().charAt(0)],
        Q8: letterMap[answers[7].toLowerCase().charAt(0) === 'a' ? 0 : answers[7].toLowerCase().charAt(0)],
      };
  
      try {
        const response = await fetch('http://127.0.0.1:5000/predict-skintype', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setResult(typeIdToName[data.prediction] || `Type ID ${data.prediction}`);
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
  

  const Question = ({ question, options, questionIndex }) => {
    return (
      <div className="question">
        <label>{question}</label>
        <div className="options">
          {options.map((option, index) => (
            <label key={index}>
              <input
                type="radio"
                name={`q${questionIndex}`}
                value={option}
                checked={answers[questionIndex] === option}
                onChange={() => handleAnswerChange(questionIndex, option)}
              />
              {option}
            </label>
          ))}
        </div>
      </div>
    );
  };

  const questions = [
    {
      question: "1. How often does your skin feel oily or shiny, especially in the T-zone?",
      options: ["Always", "Rarely", "Sometimes", "Frequently"]
    },
    {
      question: "2. Does your skin feel tight, dry, or flaky after cleansing?",
      options: ["Always", "Often", "Occasionally", "Never"]
    },
    {
      question: "3. How do moisturizers make your skin feel?",
      options: [
        "Feel perfectly hydrated",
        "Feel greasy and sticky",
        "Feel slightly oily in some areas but fine in others",
        "Absorb quickly without feeling greasy"
      ]
    },
    {
      question: "4. Do you often experience blackheads or acne in your T-zone?",
      options: ["Always", "Frequently", "Occasionally", "Never"]
    },
    {
      question: "5. How does your skin feel after waking up in the morning?",
      options: [
        "Perfectly balanced",
        "Dry or tight",
        "Normal in some areas but oily in the T-zone",
        "Greasy or shiny all over"
      ]
    },
    {
      question: "6. How does your skin react to seasonal changes?",
      options: [
        "No noticeable change",
        "Drier in winter, normal in summer",
        "Normal in winter, oily in summer",
        "Oily regardless of season"
      ]
    },
    {
      question: "7. Does your skin feel balanced throughout the day?",
      options: ["Always", "Occasionally", "Rarely", "Never"]
    },
    {
      question: "8. How does your U-zone (cheeks/jawline) typically feel?",
      options: [
        "Very oily",
        "Slightly oily",
        "Normal",
        "Dry or tight"
      ]
    }
  ];

  const Result = ({ result }) => {
    return (
      <div className="result">
        <p>Your skin type is... <span>{result}</span></p>
      </div>
    );
  };

  return (
    <div className="container">
  
  {/* HEADER BLOĞU */}
<div className="top-bar">
  <div className="logo">Glow Genie</div>
</div>

{/* BAŞLIK VE AÇIKLAMA */}
<div className="intro-section">
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <h1 className="instruction">Discover Your Skin Type</h1>
    <button className="btn" onClick={() => window.location.href = '/'}>
      <i className="fa fa-home"></i>
    </button>
  </div>
  <p className="sub-instruction">
    Answer a few questions to find out which skin type matches you best. It only takes a few minutes!
  </p>
</div>
  
      {/* SORULAR VE FORM */}
      <form onSubmit={handleSubmit}>
        {questions.map((q, index) => (
          <Question
            key={index}
            question={q.question}
            options={q.options}
            questionIndex={index}
          />
        ))}
  
        {/* HATA MESAJI */}
        {error && <p className="error-message">Please fill in all questions.</p>}
  
        {/* SUBMIT BUTONU */}
        <button type="submit" className="submit-btn">Submit</button>
      </form>
  
      {/* SONUÇ */}
      {result && <Result result={result} />}
    </div>
  );
}
export default SkinTypeTest;
