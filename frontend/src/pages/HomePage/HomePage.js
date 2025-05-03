// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // yönlendirme için eklendi
import './HomePage.css';

const HomePage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // useNavigate hook'u
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);



  const goToHomePage = () => {
    navigate('/');
  };

  const goToQuiz = () => {
    navigate('/skin-type');
  };

  const login = () => {
    fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => {
            throw new Error(err.message || "Login failed");
          });
        }
        return res.json();
      })
      .then(data => {
        console.log("Login success:", data);
        setIsLoggedIn(true);
        setLoginError('');
        setUserId(data.user_id); // 👈 burada geliyor
        alert("Login Successful!");
      })
      .catch(err => {
        console.error("Login failed:", err.message);
        setLoginError(err.message || "Invalid credentials");
      });
  };
  
  
  useEffect(() => {
    if (userId) {
      fetch(`http://127.0.0.1:5000/users/${userId}`)
        .then(res => res.json())
        .then(data => {
          console.log("Fetched user data:", data);
          setUserData(data);
        })
        .catch(err => console.error("User data fetch failed:", err));
    }
  }, [userId]);
  

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
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />

              <label htmlFor="password">Password*</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />

              {loginError && <p style={{ color: "red" }}>{loginError}</p>}

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

              <input
                type="email"
                id="profileEmail"
                value={userData?.email || ""}
                readOnly
              />

              <select id="skinType" value={userData?.skin_type_name || ""} disabled>
                <option value="Oily">Oily</option>
                <option value="Dry Skin">Dry Skin</option>
                <option value="Normal">Normal</option>
                <option value="Combination">Combination</option>
                <option value="I don't know">I don't know</option>
              </select>

              <select id="skinTone" value={userData?.skin_tone_name || ""} disabled>
              <option value="Light Skin">Light Skin</option>
              <option value="Medium Skin">Medium Skin</option>
              <option value="Dark Skin">Dark Skin</option>
            </select>

              <input
                type="text"
                value={(userData?.allergens || []).join(', ')}
                placeholder="Allergens: Paraben, Alcohol, etc."
                readOnly
              />

              <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '16px' }}>
                <a href="/UpdatePassword" id="changePasswordLink">
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
