// src/pages/HomePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // yönlendirme için eklendi
import './HomePage.css';

const HomePage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // useNavigate hook'u

  const goToHomePage = () => {
    navigate('/');
  };

  const goToQuiz = () => {
    navigate('/skin-type');
  };

  const login = () => {
    setIsLoggedIn(true);
    alert("Login Successful!");
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      <div className="container">
        <main>
          <section className="options">
            <button
              className="option-btn"
              onClick={goToQuiz} // burada güncellendi
            >
              Learn Your Skin Type
            </button>

            <button
              className="option-btn"
              onClick={() => setShowPopup(true)}
            >
              Is This Skin Care Product Right for Me?
            </button>

            <button className="option-btn">
              Suggest Skin Care Products for Me
            </button>
          </section>

          {showPopup && (
            <div id="skinTypePopup" className="popup">
              <p className="popup-description">
                To proceed further, we need to know your skin type.
                <br />
                Do you know your skin type? If yes, please update it from your profile.
                <br />
                If not, you can solve our quiz.
              </p>
              <div className="popup-buttons">
                <div className="popup-btn-container">
                  <p>Click the button below to go to Home Page to update your skin type.</p>
                  <button onClick={goToHomePage}>Return to Home Page</button>
                </div>

                <div className="popup-btn-container">
                  <p>Click the button below and take the quiz to find out your skin type.</p>
                  <button onClick={goToQuiz}>Solve the Quiz</button>
                </div>
              </div>
            </div>
          )}

          {!isLoggedIn ? (
            <section className="login" id="loginCard">
              <h2>Login</h2>
              <form>
                <label htmlFor="email">E-mail*</label>
                <input type="email" id="email" required />

                <label htmlFor="password">Password*</label>
                <input type="password" id="password" required />

                <a href="/ForgotPassword" className="forgot-password">
                  Forgot Password?
                </a>

                <br />
                <br />
                <button type="button" className="login-btn" onClick={login}>
                  Login
                </button>
              </form>
              <p className="register">
                Don't have an account? <a href="/register">Register Here</a>
              </p>
            </section>
          ) : (
            <div id="profileCard">
              <h2>Profile</h2>
              <input type="email" id="profileEmail" placeholder="E-mail" readOnly />
              <select id="skinType">
                <option>Oily</option>
                <option>Dry</option>
                <option>Normal</option>
                <option>Combination</option>
                <option>I don't know</option>
              </select>
              <select id="skinTone">
                <option>Light Skin</option>
                <option>Medium Skin</option>
                <option>Dark Skin</option>
              </select>
              <input type="text" placeholder="Allergens: Paraben, Alcohol, etc." />
              <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '16px' }}>
                <a href="/UpdatePassword" id="changePasswordLink" style={{ display: 'inline-block' }}>
                  Change Password
                </a>
              </div>
              <button>Update</button>
              <button onClick={logout}>Log Out</button>
            </div>
          )}
        </main>
      </div>

      <div style={{ height: '1000px' }}>{/* just to make scrolling effect possible */}</div>
    </>
  );
};

export default HomePage;
