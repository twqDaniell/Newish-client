import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const handleLogin = () => {

  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
