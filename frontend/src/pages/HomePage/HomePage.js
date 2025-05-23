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
  const [skinTypes, setSkinTypes] = useState([]);
  const [skinTones, setSkinTones] = useState([]);
  const [isEditing, setIsEditing] = useState(false);



  const goToHomePage = () => {
    navigate('/');
  };

  const goToQuiz = () => {
    navigate('/skin-type');
  };

  const goToForgotPassword = () => {
  navigate('/forgot-password');
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
        localStorage.setItem("token", data.token); // ✨ Token burada saklanıyor
        setIsLoggedIn(true);
        setLoginError('');
        setUserId(data.user_id);
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


  useEffect(() => {
  // Skin types
  fetch("http://127.0.0.1:5000/skin-types")
    .then(res => res.json())
    .then(data => setSkinTypes(data))
    .catch(err => console.error("Skin types fetch failed", err));

  // Skin tones
  fetch("http://127.0.0.1:5000/skin-tones")
    .then(res => res.json())
    .then(data => setSkinTones(data))
    .catch(err => console.error("Skin tones fetch failed", err));
}, []);


const updateProfile = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Giriş yapılmamış. Lütfen tekrar login olun.");
    return;
  }

  fetch("http://127.0.0.1:5000/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      skin_type_id: userData?.skin_type_id,
      skin_tone_id: userData?.skin_tone_id,
      allergens: userData?.allergens || []
    })
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Update failed");
      }
      return res.json();
    })
    .then(data => {
      console.log("✅ Profile updated:", data);
      alert("✅ Profile updated successfully!");
      setUserData(data.updated_profile);  // 💥 güncel adları da alalım
      setIsEditing(false);
    })
    .catch(err => {
      console.error("❌ Profile update failed:", err);
      alert("❌ Failed to update profile");
    });
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

            <button
              type="button"
              onClick={goToForgotPassword}
              className="forgot-password"
              style={{
                background: 'none',
                border: 'none',
                color: '#007bff',
                textDecoration: 'underline',
                cursor: 'pointer',
                padding: 0,
                fontSize: 'inherit'
              }}
            >
              Forgot Password?
            </button>

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

              {/* SKIN TYPE */}
            <select
              id="skinType"
              value={
                isEditing
                  ? userData?.skin_type_id || ""
                  : skinTypes.find(t => t.id === userData?.skin_type_id)?.name || userData?.skin_type_name || ""
              }
              onChange={
                isEditing
                  ? e => setUserData({ ...userData, skin_type_id: parseInt(e.target.value) })
                  : undefined
              }
              disabled={!isEditing}
            >
              {!isEditing && <option>{userData?.skin_type_name || "Not set"}</option>}
              {isEditing &&
                <>
                  <option value="">Select skin type</option>
                  {skinTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </>
              }
            </select>

            {/* SKIN TONE */}
            <select
              id="skinTone"
              value={
                isEditing
                  ? userData?.skin_tone_id || ""
                  : skinTones.find(t => t.id === userData?.skin_tone_id)?.name || userData?.skin_tone_name || ""
              }
              onChange={
                isEditing
                  ? e => setUserData({ ...userData, skin_tone_id: parseInt(e.target.value) })
                  : undefined
              }
              disabled={!isEditing}
            >
              {!isEditing && <option>{userData?.skin_tone_name || "Not set"}</option>}
              {isEditing &&
                <>
                  <option value="">Select skin tone</option>
                  {skinTones.map(tone => (
                    <option key={tone.id} value={tone.id}>
                      {tone.name}
                    </option>
                  ))}
                </>
              }
            </select>

            {/* ALLERGENS */}
            <input
              type="text"
              value={(userData?.allergens || []).join(', ')}
              onChange={isEditing ? e =>
                setUserData({
                  ...userData,
                  allergens: e.target.value.split(',').map(item => item.trim())
                }) : undefined}
              placeholder="Allergens: Paraben, Alcohol, etc."
              readOnly={!isEditing}
            />


            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '16px' }}>
                <button
                  onClick={() => navigate('/update-password')}
                  id="changePasswordLink"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#007bff',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Change Password
                </button>
              </div>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                ) : (
                  <>
                    <button onClick={updateProfile}>Update Profile</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                  </>
                )}
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
