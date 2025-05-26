import React, { useState, useEffect } from 'react';
import './UpdatePassword.css';

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendFeedback, setResendFeedback] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [showWaitMessage, setShowWaitMessage] = useState(false);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);

  const validatePassword = (pwd) => {
    const regex = /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[\W_]).{6,}$/;
    return regex.test(pwd);
  };

  const submitPassword = () => {
    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords don’t match.");
    } else if (!validatePassword(newPassword)) {
      setMessage(`
        ❌ Password is weak.<br/>
        <small style="font-size: 0.9rem; color: #555;">
          Password must contain at least:
          <ul class="mt-2" style="text-align: left; padding-left: 1rem;">
            <li>One uppercase letter</li>
            <li>One lowercase letter</li>
            <li>One number</li>
            <li>One special character</li>
            <li>Minimum 6 characters</li>
          </ul>
        </small>
      `);
    } else {
      setMessage("✅ Your new password is saved.");
      setShowSuccessPopup(true);
    }
  };

  const resetForm = () => {
    setNewPassword('');
    setConfirmPassword('');
    setMessage('');
  };

  const handleResend = () => {
    if (resendDisabled) return;

    setResendDisabled(true);
    setShowProgress(true);
    setShowWaitMessage(true);
    setSecondsLeft(10);
    setResendFeedback('Please wait to receive a new verification link again. (10 seconds)');
    setIsFeedbackVisible(true);

    // Buraya resend API çağrısı eklenebilir.
  };

  useEffect(() => {
    if (secondsLeft <= 0) {
      setResendDisabled(false);
      setShowProgress(false);
      setShowWaitMessage(false);
      setResendFeedback('');
      setIsFeedbackVisible(false);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const progressWidth = (secondsLeft / 10) * 100;

  return (
    <div className="container mt-4">
      <h2 className="logo text-center my-4">Glow Genie</h2>

      <div className="form-container container">
        <h4 className="mb-4 text-center">Please enter your new password</h4>

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

        <div
          id="password-message"
          className="text-center"
          style={{ whiteSpace: 'pre-wrap' }}
          dangerouslySetInnerHTML={{ __html: message }}
        />

        <div className="text-center">
          <button className="submit-btn me-2" onClick={submitPassword}>Submit</button>
          <button className="cancel-btn" onClick={resetForm}>Cancel</button>
        </div>
      </div>

      {showSuccessPopup && (
        <div className="container d-flex justify-content-center">
          <div className="popup mt-4 text-center">
            <img
              src="/images/ChatGPT_Image_8_May_2025_12_46_11.png"
              alt="Send mail img"
              className="img-fluid rounded mb-3"
            />
            <h1 className="custom-purple">You're almost there!</h1>
            <p className="thanks-text fw-bold">Thanks for confirming your request.</p>
            <p className="info-text">
              Please verify your email address to complete the password update process.
            </p>
            <p className="info-text">
              We have sent a verification link to your email address <strong>user@example.com</strong>.
            </p>

            <p className="resend-text">
              Didn't receive an email?{' '}
            <button
              type="button"
              className={`custom-purple resend-link ${resendDisabled ? 'disabled' : ''}`}
              id="resend-link"
              onClick={handleResend}
              disabled={resendDisabled}
              style={{ border: 'none', background: 'none', padding: 0, color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Resend link
            </button>
            </p>


            {showWaitMessage && (
              <p className="wait-message" style={{ color: 'green' }}>
                A new verification link has been sent to your email.
              </p>
            )}

            {showProgress && (
              <div className="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${progressWidth}%`,
                    backgroundColor: '#f5dbed',
                    transition: 'width 1s linear'
                  }}
                  aria-valuenow={progressWidth}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
            )}

            {resendFeedback && (
              <div className="message-container">
                <p
                  id="resend-feedback"
                  className="resend-message"
                  style={{ display: isFeedbackVisible ? 'block' : 'none' }}
                >
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

export default UpdatePassword;