import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';


function Login({ onLogin, user }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (user.loggedIn === null) {
    return 'Loading...';
  }
  if (user.loggedIn) {
    return <Redirect to="/grid-builder" />;
  }

  return (
    <form
      onSubmit={e => { e.preventDefault(); onLogin(email, password); }}
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        marginTop: '50px',
      }}
    >
      <div>
        <label htmlFor="loginEmail">
          Email:
          <input
            id="loginEmail"
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label htmlFor="loginPassword">
          Password:
          <input
            id="loginPassword"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </label>
      </div>
      <div>
        <input type="submit" value="Submit" />
      </div>
    </form>
  );
}

export default Login;
