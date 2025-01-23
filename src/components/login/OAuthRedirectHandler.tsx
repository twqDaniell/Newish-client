// src/components/OAuthRedirectHandler.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthRedirectHandler: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the URL fragment
    const hash = window.location.hash.substring(1); // Remove the '#'
    const params = new URLSearchParams(hash);

    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    const user = params.get('user'); // Assuming user data is JSON stringified]

    console.log(accessToken, refreshToken, user);
    

    if (accessToken && refreshToken && user) {
      // Store tokens and user info in localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', decodeURIComponent(user));

      navigate('/')
    } else {
      // Handle errors or missing tokens
      alert('Authentication failed. Please try again.');
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
      <h2>Logging you in...</h2>
    </div>
  );
};

export default OAuthRedirectHandler;
