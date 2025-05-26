import React, { useState, useRef, useEffect } from "react";
import './ForgotPassword.css';

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showCodeCard, setShowCodeCard] = useState(false);
  const [code, setCode] = useState(["", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [wrongCodeAttempts, setWrongCodeAttempts] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [progress, setProgress] = useState(100);
  const [showProgress, setShowProgress] = useState(false);
  const [showWaitMessage, setShowWaitMessage] = useState(false);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);

  const inputRefs = useRef([]);

  const validatePassword = (pwd) => {
    const regex = /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[\W_]).{6,}$/;
    return regex.test(pwd);
  };

  const handleSubmitPassword = () => {
    if (newPassword !== confirmPassword) {
      setPasswordMessage("❌ Passwords don’t match.");
      setShowCodeCard(false);
    } else if (!validatePassword(newPassword)) {
      setPasswordMessage(`
        ❌ Password is weak.<br>
        <small style="font-size: 0.9rem; color: #555;">
          Password must contain at least:
          <ul class="mt-2" style="text-align: left;">
            <li>One uppercase letter</li>
            <li>One lowercase letter</li>
            <li>One number</li>
            <li>One special character</li>
            <li>Minimum 6 characters</li>
          </ul>
        </small>
      `);
      setShowCodeCard(false);
    } else {
      setPasswordMessage("✅ Your new password is saved.");
      setShowSuccessPopup(true);
      setShowCodeCard(true);
    }
  };

  const handleResetForm = () => {
    setEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMessage("");
    setShowCodeCard(false);
    setShowSuccessPopup(false);
  };

  const handleCodeChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 3) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmitCode = () => {
    const enteredCode = code.join("");
    const correctCode = "1234";
    if (enteredCode !== correctCode) {
      const attempts = wrongCodeAttempts + 1;
      setWrongCodeAttempts(attempts);
      if (attempts >= 3 && !resendCooldown) {
        setErrorMessage("You’ve entered the wrong code 3 times. Please wait 10 mins.");
        setResendCooldown(true);
        setTimeout(() => {
          setResendCooldown(false);
          setWrongCodeAttempts(0);
        }, 10 * 60 * 1000);
      } else {
        setErrorMessage("Confirmation code is not correct.");
      }
    } else {
      setErrorMessage("✅ Code confirmed!");
      setTimeout(() => window.location.href = "/", 3000);
    }
  };

  const handleResendCode = () => {
    if (resendCooldown || resendCount >= 2) {
      setErrorMessage("Please wait 10 mins to request a new code.");
      return;
    }

    alert("Verification code has been re-sent.");
    setResendCount(resendCount + 1);
    setSecondsLeft(10);
    setShowProgress(true);
    setShowWaitMessage(true);
    setIsFeedbackVisible(true);

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowProgress(false);
          setShowWaitMessage(false);
          setIsFeedbackVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const progressWidth = (secondsLeft / 10) * 100;

  return (
    <div className="container">
      <h2 className="logo text-center my-4">Glow Genie</h2>

      <div className="form-container container">
        <h4 className="mb-4 text-center">Please enter your new password</h4>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Your Registered E-mail address*</label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

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
          id="password-message"
          className="text-center"
          dangerouslySetInnerHTML={{ __html: passwordMessage }}
        ></p>

        <div className="text-center">
          <button className="submit-btn" onClick={handleSubmitPassword}>Submit</button>
          <button className="cancel-btn" onClick={handleResetForm}>Cancel</button>
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

      {showCodeCard && (
        <div className="code-card mt-4">
          <h3>We sent a code to your e-mail address. Please enter the 4-digit code.</h3>
          <div style={{ color: errorMessage.includes("✅") ? "green" : "red" }}>
            {errorMessage}
          </div>

          <div className="code-inputs">
            {code.map((c, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                value={c}
                onChange={(e) => handleCodeChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                ref={(el) => (inputRefs.current[i] = el)}
              />
            ))}
          </div>

          <button className="verify-btn mt-3" onClick={handleSubmitCode}>Submit</button>
        </div>
      )}
    </div>
  );
}