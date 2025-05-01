import React, { useState, useEffect, useRef } from 'react';
import './UpdatePassword.css';

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [codeVisible, setCodeVisible] = useState(false);
  const [codeInputs, setCodeInputs] = useState(['', '', '', '']);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [codeMessage, setCodeMessage] = useState('');
  const inputRefs = useRef([]);

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    return regex.test(pwd);
  };

  const handlePasswordSubmit = () => {
    if (newPassword !== confirmPassword) {
      setPasswordMessage("Passwords don’t match.");
      setCodeVisible(false);
    } else if (!validatePassword(newPassword)) {
      setPasswordMessage(
        `Password is weak. Password must contain at least:
- One uppercase letter
- One lowercase letter
- One number
- One special character
- Minimum 6 characters`
      );
      setCodeVisible(false);
    } else {
      setPasswordMessage("Your new password is saved.");
      setCodeVisible(true);
    }
  };

  const handleReset = () => {
    setNewPassword('');
    setConfirmPassword('');
    setPasswordMessage('');
    setCodeVisible(false);
    setCodeInputs(['', '', '', '']);
    setCodeMessage('');
  };

  const handleCodeChange = (value, index) => {
    const newInputs = [...codeInputs];
    newInputs[index] = value;
    setCodeInputs(newInputs);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !codeInputs[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmitCode = () => {
    const code = codeInputs.join('');
    const correctCode = '1234';

    if (code !== correctCode) {
      const attempts = wrongAttempts + 1;
      setWrongAttempts(attempts);

      if (attempts >= 3) {
        if (!resendCooldown) {
          setCodeMessage('You’ve entered the wrong code 3 times, please wait 10 mins to request a new one.');
          setResendCooldown(true);
          setTimeout(() => {
            setResendCooldown(false);
            setWrongAttempts(0);
          }, 10 * 60 * 1000);
        }
      } else {
        setCodeMessage('Confirmation code is not correct.');
      }
    } else {
      setCodeMessage('Code confirmed! Redirecting...');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 7000);
    }
  };

  const handleResendCode = () => {
    if (resendCooldown || resendCount >= 2) {
      setCodeMessage('Please wait 10 mins to request a new code.');
      return;
    }
    setResendCount(resendCount + 1);
    alert('Verification code has been re-sent.');
    setCodeMessage('');
  };

  return (
    <div className="container">
      <h2 className="logo">Glow Genie</h2>

      <div className="code-card">
        <h3>Please enter your new password</h3>

        <label htmlFor="new-password">New Password*</label>
        <input
          type="password"
          id="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <label htmlFor="confirm-password">Confirm Password*</label>
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <p style={{ whiteSpace: 'pre-line', color: passwordMessage.includes('weak') || passwordMessage.includes("don’t") ? 'red' : 'green' }}>
          {passwordMessage}
        </p>

        <button className="verify-btn" onClick={handlePasswordSubmit}>Submit</button>
        <button className="verify-btn" onClick={handleReset}>Cancel</button>
      </div>

      {codeVisible && (
        <div className="code-card">
          <h3>We sent a code to your e-mail address. Please enter the 4-digit code.</h3>

          {codeMessage && <div style={{ color: codeMessage.includes('correct') ? 'red' : 'green' }}>{codeMessage}</div>}

          <div className="code-inputs">
            {codeInputs.map((val, idx) => (
              <input
                key={idx}
                maxLength={1}
                value={val}
                onChange={(e) => handleCodeChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                ref={(el) => (inputRefs.current[idx] = el)}
              />
            ))}
          </div>

          <div style={{ marginTop: '10px' }}>
            <button
              style={{ background: 'none', color: 'purple', border: 'none', cursor: 'pointer' }}
              onClick={handleResendCode}
            >
              Re-send the code
            </button>
          </div>
          <br />
          <button className="verify-btn" onClick={handleSubmitCode}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default PasswordReset;