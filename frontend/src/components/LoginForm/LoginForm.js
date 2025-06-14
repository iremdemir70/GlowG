import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
        setLoginError('');
          /* ---------- ⭐️ oturum verisini kaydet ---------- */
        localStorage.setItem('token',      data.token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId',     data.user_id);
        localStorage.setItem('isAdmin',    data.is_admin);  // <‑‑ kritik
        /* ---------------------------------------------- */

        onLoginSuccess(data);  // HomePage'e haber ver
      })
      .catch(err => {
        console.error("Login failed:", err.message);
        setLoginError(err.message || "Invalid credentials");
      });
  };

  return (
    <section className="login" id="loginCard">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">E-mail*</label>
        <input
          type="email"
          id="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password*</label>
        <input
          type="password"
          id="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="login-links">
          <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
        </div>

        <button type="submit" className="login-btn">Login</button>
      </form>

      {loginError && <p className="error-message" style={{ color: 'red' }}>{loginError}</p>}

      <p className="register">
        Don't have an account? <a href="/register">Register Here</a>
      </p>
    </section>
  );
};

export default LoginForm;
