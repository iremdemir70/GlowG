import React, { useState, useEffect } from 'react';
import './RegisterVerification.css';

const RegisterVerification = () => {
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [progressWidth, setProgressWidth] = useState(100);
  const [isWaitMessageVisible, setIsWaitMessageVisible] = useState(false);
  const [isProgressVisible, setIsProgressVisible] = useState(false);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setIsResendDisabled(false);
      setProgressWidth(0);
      setIsProgressVisible(false);
      setIsWaitMessageVisible(false);
      setIsFeedbackVisible(false);
    } else {
      setProgressWidth((secondsLeft / 10) * 100);
    }
  }, [secondsLeft]);

  const handleResendClick = () => {
    if (isResendDisabled) return;

    setIsResendDisabled(true);
    setIsFeedbackVisible(true);
    setIsWaitMessageVisible(true);
    setIsProgressVisible(true);
    setSecondsLeft(10);
  };

  return (
    <div>
      
      <h2 className="logo text-center mt-4">Glow Genie</h2>

      {/* Popup container */}
      <div className="d-flex justify-content-center">
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
            We have sent a verification link to your email address{' '}
            <strong>user@example.com</strong>.
          </p>
          <p className="resend-text">
            Didn't receive an email?{' '}
            <button
              type="button"
              className={`custom-purple resend-link ${isResendDisabled ? 'disabled' : ''}`}
              id="resend-link"
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
            <p className="wait-message">
              A new verification link has been sent to your email.
            </p>
          )}

          {isProgressVisible && (
            <div className="progress" id="progress-bar-container">
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${progressWidth}%`,
                  backgroundColor: progressWidth <= 0 ? 'white' : '#f5dbed',
                  transition: 'width 1s linear',
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
    </div>
  );
};

export default RegisterVerification;
