import React, { useState, useEffect } from 'react';
import './RegisterVerification.css';

const RegisterVerification = () => {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [isWaitMessageVisible, setIsWaitMessageVisible] = useState(false);
  const [isProgressVisible, setIsProgressVisible] = useState(false);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(true);

  // ✅ localStorage'dan e-posta al
  const [registeredEmail, setRegisteredEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("registeredEmail");
    if (email) setRegisteredEmail(email);
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setIsResendDisabled(false);
      setIsWaitMessageVisible(false);
      setIsProgressVisible(false);
      setIsFeedbackVisible(false);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

const handleResendClick = async () => {
  if (isResendDisabled || !registeredEmail) return;

  setSecondsLeft(10);
  setIsResendDisabled(true);
  setIsWaitMessageVisible(true);
  setIsProgressVisible(true);
  setIsFeedbackVisible(true);

  try {
    const response = await fetch("http://127.0.0.1:5000/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: registeredEmail })
    });

    const data = await response.json();
    if (!response.ok) {
      alert(`Resend failed: ${data.error || "Unknown error"}`);
    }
  } catch (err) {
    alert(`Error: ${err.message}`);
  }
};


  const progressWidth = (secondsLeft / 10) * 100;

  return (
    <div>
      <h2 className="logo text-center mt-4">Glow Genie</h2>

      {showSuccessPopup && (
        <div className="container d-flex justify-content-center">
          <div className="popup mt-4 text-center">
            <img
              src="/images/ChatGPT_Image_8_May_2025_12_46_11.png"
              alt="Send mail img"
              className="img-fluid rounded mb-3"
            />
            <h1 className="custom-purple title">You're almost there!</h1>
            <p className="thanks-text fw-bold">Thanks for registering!</p>
            <p className="info-text">
              Please verify your email address to complete your access to GlowGenie.
            </p>
            <p className="info-text">
              We have sent a verification link to your email address <strong>{registeredEmail || "your email"}</strong>.
            </p>
            <p className="resend-text">
              Didn't receive an email?{' '}
              <button
                type="button"
                className={`custom-purple resend-link ${isResendDisabled ? 'disabled' : ''}`}
                onClick={handleResendClick}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  textDecoration: 'underline',
                  cursor: isResendDisabled ? 'not-allowed' : 'pointer',
                  padding: 0,
                  fontSize: 'inherit'
                }}
              >
                Resend link
              </button>
            </p>

            {isWaitMessageVisible && (
              <p className="wait-message" style={{ color: 'green' }}>
                A new verification link has been sent to your email.
              </p>
            )}

            {isProgressVisible && (
              <div className="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                          width: `${progressWidth}%`,
                          backgroundColor: progressWidth <= 0 ? 'white' : '#f5dbed',
                          transition: 'width 1s linear'
                        }}
                  aria-valuenow={progressWidth}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            )}

            {isFeedbackVisible && (
              <div className="message-container">
                <p className="resend-message">
                  Please wait to receive a new verification link again. ({secondsLeft} seconds)
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterVerification;