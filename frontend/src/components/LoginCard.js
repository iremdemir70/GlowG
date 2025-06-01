import React, { useState } from 'react';

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
        <div id="card-ccontainer">
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
          <button onClick={login}>Login</button>
        </div>
      ) : (
        <div id="card-container">
          <input value={email} readOnly />
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default LoginCard;