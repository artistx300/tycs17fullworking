// frontend/src/pages/authrization/SignIn.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode
import './SignIn.css';

const SignIn = ({ setIsAuthenticated, setIsAdmin }) => { // Receive setIsAdmin as a prop
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token); // Store token

        // Decode the token to extract role information
        const decodedToken = jwtDecode(data.token);
        const { identity } = decodedToken;
        const isAdmin = identity && identity.role === 'admin';

        // Update global auth and role states
        setIsAuthenticated(true);
        setIsAdmin(isAdmin);

        navigate('/'); // Redirect to the home page after successful login
      } else {
        setError(data.msg || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Sign-in error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
