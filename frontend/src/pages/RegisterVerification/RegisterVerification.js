import React, { useState, useRef, useEffect } from "react";
import "./RegisterVerification.css";
import { useNavigate } from "react-router-dom";

const RegisterVerification = () => {
  const [code, setCode] = useState(["", "", "", ""]);
  const [attemptCount, setAttemptCount] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const [lastResendTime, setLastResendTime] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [verified, setVerified] = useState(false);
  const correctCode = "1234";
  const navigate = useNavigate();

  const inputRefs = useRef([]);

  useEffect(() => {
    if (verified) {
      const timeout = setTimeout(() => {
        navigate("/"); // ya da: window.location.href = 'index.html';
      }, 7000);
      return () => clearTimeout(timeout);
    }
  }, [verified, navigate]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

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

  const handleSubmit = () => {
    const enteredCode = code.join("");

    if (enteredCode === correctCode) {
      setErrorMessage("");
      setVerified(true);
    } else {
      const newAttempts = attemptCount + 1;
      setAttemptCount(newAttempts);

      if (newAttempts >= 3) {
        setErrorMessage("You’ve entered the wrong code 3 times, please request a new one.");
      } else {
        setErrorMessage("Confirmation code is not correct.");
      }

      setCode(["", "", "", ""]);
      inputRefs.current[0].focus();
    }
  };

  const resendCode = () => {
    const now = new Date();

    if (resendCount >= 2 && lastResendTime && now - lastResendTime < 10 * 60 * 1000) {
      setErrorMessage("Please wait 10 mins to request a new code.");
      return;
    }

    setResendCount(resendCount + 1);
    setLastResendTime(now);
    setAttemptCount(0);
    setErrorMessage("");
    setCode(["", "", "", ""]);
    inputRefs.current[0].focus();

    alert("A new code has been sent to your email.");
  };

  return (
    <div>
      <h2 className="logo">Glow Genie</h2>
      <div className="verification-wrapper">
        <div className="popup-group">
          {!verified && (
            <div className="popup" id="first-popup">
              <p className="popup-description">
                We have sent you an email so we can verify your account. Could you please check your email address?
              </p>
            </div>
          )}

          {verified && (
            <div className="popup" id="second-popup">
              <p className="popup-description">
                Your email address has been verified, you can log in.
              </p>
            </div>
          )}
        </div>

        <div className="code-card">
          <h3>We sent a code to your e-mail address please enter the 4-digit code.</h3>
          {errorMessage && <div style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</div>}

          <div className="code-inputs">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>

          <div style={{ marginTop: "10px" }}>
            <button
              type="button"
              onClick={resendCode}
              style={{ background: "none", border: "none", color: "purple", cursor: "pointer" }}
            >
              Re-send the code
            </button>
          </div>
          <br />
          <button className="verify-btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterVerification;
