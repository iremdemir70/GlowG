import React, { useState, useEffect } from "react";
import './ForgotPassword.css';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [showWaitMessage, setShowWaitMessage] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setShowWaitMessage(false);
      setShowProgress(false);
      setIsFeedbackVisible(false);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleSubmit = async () => {
    if (!email) {
      setError("❌ Please enter your email.");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:5000/forgot-password", { email });
      setShowSuccessPopup(true);
    } catch (err) {
      setError("❌ Failed to send reset link.");
    }
  };

  const handleResendCode = async () => {
    if (secondsLeft > 0) return;

    try {
      await axios.post("http://127.0.0.1:5000/resend-verification", { email });

      setSecondsLeft(10);
      setShowWaitMessage(true);
      setShowProgress(true);
      setIsFeedbackVisible(true);
    } catch (err) {
      alert("Resend failed.");
    }
  };

  const progressWidth = (secondsLeft / 10) * 100;

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

        <p className="text-center text-danger">{error}</p>

        <div className="text-center">
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>

      {showSuccessPopup && (
        <div className="container d-flex justify-content-center">
          <div className="popup mt-4 text-center">
            <img src="/images/ChatGPT_Image_8_May_2025_12_46_11.png" alt="Send mail img" className="img-fluid rounded mb-3" />
            <h1 className="custom-purple">You're almost there!</h1>
            <p className="thanks-text fw-bold">Please verify your email address to complete your password reset.</p>
            <p className="info-text">
              We have sent a verification link to your email address <strong>{email || "user@example.com"}</strong>.
            </p>
            <p className="resend">
              Didn't receive an email?{" "}
              <a href="#" onClick={handleResendCode} className="custom-purple text-decoration-none">Resend link</a>
            </p>

            {showWaitMessage && (
              <p className="wait-message" style={{ color: "green" }}>A new verification link has been sent.</p>
            )}

            {showProgress && (
              <div className="progress" style={{ display: "block" }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: progressWidth + '%',
                    backgroundColor: '#f5dbed',
                    transition: 'width 1s linear'
                  }}
                />
              </div>
            )}

            {isFeedbackVisible && (
              <p className="resend-message">Please wait to receive a new verification link again. ({secondsLeft} seconds)</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
