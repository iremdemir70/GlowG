import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // yönlendirme için

const LoginCard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const login = () => {
    if (email === 'user@example.com' && password === '1234') {
      setLoggedIn(true);
    } else {
      alert('E-mail or password is incorrect!');
    }
  };

  const logout = () => {
    setLoggedIn(false);
    setEmail('');
    setPassword('');
  };

  return (
    <div>
      {!loggedIn ? (
        <div id="loginCard">
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button onClick={login}>Login</button>
          <p className="mt-2">
            Don’t have an account?{" "}
            <Link to="/register" style={{ color: "#4b0082", textDecoration: "underline" }}>
              Register
            </Link>
          </p>
        </div>
      ) : (
        <div id="profileCard">
          <input value={email} readOnly />
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default LoginCard;
