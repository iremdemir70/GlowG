import React, { useState, useRef, useEffect } from "react";

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [showCodeCard, setShowCodeCard] = useState(false);
  const [code, setCode] = useState(["", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [wrongCodeAttempts, setWrongCodeAttempts] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(false);
  const [resendCount, setResendCount] = useState(0);

  const inputRefs = useRef([]);

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    return regex.test(pwd);
  };

  const handleSubmitPassword = () => {
    if (newPassword !== confirmPassword) {
      setPasswordMessage("Passwords don’t match.");
      setShowCodeCard(false);
    } else if (!validatePassword(newPassword)) {
      setPasswordMessage(
        `Password is weak.
        - One uppercase letter
        - One lowercase letter
        - One number
        - One special character
        - At least 6 characters`
      );
      setShowCodeCard(false);
    } else {
      setPasswordMessage("Your new password is saved.");
      setShowCodeCard(true);
    }
  };

  const handleResetForm = () => {
    setEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMessage("");
    setShowCodeCard(false);
  };

  const handleCodeChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
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
        setErrorMessage("You’ve entered the wrong code 3 times, please request a new one.\nPlease wait 10 mins to request a new code.");
        setResendCooldown(true);
        setTimeout(() => {
          setResendCooldown(false);
          setWrongCodeAttempts(0);
        }, 10 * 60 * 1000); // 10 dakika
      } else {
        setErrorMessage("Confirmation code is not correct.");
      }
    } else {
      setErrorMessage("Code confirmed!");
      setWrongCodeAttempts(0);
      setTimeout(() => {
        window.location.href = "/"; // yönlendirme
      }, 7000);
    }
  };

  const handleResendCode = () => {
    if (resendCooldown || resendCount >= 2) {
      setErrorMessage("Please wait 10 mins to request a new code.");
      return;
    }

    alert("Verification code has been re-sent.");
    setResendCount(resendCount + 1);
    setErrorMessage("");
  };

  return (
    <div className="container">
      <h2 className="logo">Glow Genie</h2>

      {/* Password Reset Form */}
      <div className="code-card">
        <h3>Please enter your new password and your E-mail address</h3>
        <label>Your Registered E-mail address*</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>New Password*</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <label>Confirm Password*</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <p style={{ color: passwordMessage.includes("saved") ? "green" : "red" }}>
          {passwordMessage}
        </p>

        <button className="verify-btn" onClick={handleSubmitPassword}>
          Submit
        </button>
        <button className="verify-btn" onClick={handleResetForm}>
          Cancel
        </button>
      </div>

      {/* Code Verification Form */}
      {showCodeCard && (
        <div className="code-card">
          <h3>We sent a code to your e-mail address. Please enter the 4-digit code.</h3>
          <div style={{ color: errorMessage.includes("confirmed") ? "green" : "red" }}>
            {errorMessage}
          </div>

          <div className="code-inputs">
            {[0, 1, 2, 3].map((i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                value={code[i]}
                onChange={(e) => handleCodeChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                ref={(el) => (inputRefs.current[i] = el)}
              />
            ))}
          </div>

          <div style={{ marginTop: "10px" }}>
            <a href="#" onClick={handleResendCode} style={{ color: "purple" }}>
              Re-send the code
            </a>
          </div>
          <br />
          <button className="verify-btn" onClick={handleSubmitCode}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
