import React, { useState, useEffect } from "react";
import '../ForgotPassword/ForgotPassword.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [resetToken, setResetToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("reset_token");
    if (token) setResetToken(token);
  }, []);

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      setPasswordMessage("❌ All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("❌ Passwords don’t match.");
      return;
    }

    if (!validatePassword(newPassword)) {
      setPasswordMessage(`
        ❌ Weak password.<br>
        <ul><li>Min 6 characters</li><li>Upper/lowercase</li><li>Number</li><li>Special char</li></ul>
      `);
      return;
    }

    try {
      await axios.post("http://127.0.0.1:5000/reset-password", {
        reset_token: resetToken,
        new_password: newPassword
      });
      setPasswordMessage("✅ Password reset. Redirecting...");
      setTimeout(() => navigate("/home-page"), 3000);
    } catch (err) {
      setPasswordMessage("❌ Reset failed. Token may be expired.");
    }
  };

  return (
    <div className="container">
      <h2 className="logo text-center my-4">Glow Genie</h2>
      <div className="form-container container">
        <h4 className="mb-4 text-center">Reset your password</h4>

        <div className="mb-3">
          <label htmlFor="new-password" className="form-label">New Password*</label>
          <input
            type="password"
            id="new-password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="confirm-password" className="form-label">Confirm Password*</label>
          <input
            type="password"
            id="confirm-password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <p
          className="text-center"
          dangerouslySetInnerHTML={{ __html: passwordMessage }}
        ></p>

        <div className="text-center">
          <button className="submit-btn" onClick={handleSubmit}>Reset Password</button>
        </div>
      </div>
    </div>
  );
}
