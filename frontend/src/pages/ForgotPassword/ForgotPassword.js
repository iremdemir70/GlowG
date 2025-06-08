import React, { useState } from "react";
import './ForgotPassword.css';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      setMessage("❌ Please enter your email.");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:5000/forgot-password", { email });
      setMessage("✅ Reset link has been sent to your email.");
    } catch (err) {
      setMessage("❌ Failed to send reset link.");
    }
  };

  return (
    <div className="container">
      <h2 className="logo text-center my-4">Glow Genie</h2>

      <div className="form-container container">
        <h4 className="mb-4 text-center">Request password reset</h4>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Your Registered Email*</label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <p className="text-center">{message}</p>

        <div className="text-center">
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}
