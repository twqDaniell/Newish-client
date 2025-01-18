import React from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import loginIllustration from "../assets/login_illustration.png";
import logo from "../assets/logo.png";
import { Button, Form, Input, Radio } from "antd";

const LoginPage = () => {
  return (
    <div className="login-page">
      {/* Left Section */}
      <div className="left-section">
        <div className="content">
          <img
            src={logo} // Replace with your illustration URL
            alt="Illustration"
            className="illustration"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="right-section">
        {/* <form className="login-form">
            <h2>Sign In</h2>
            <p>
              If you don’t have an account, <a href="#">Register here!</a>
            </p>
  
            <label>Email</label>
            <input type="email" placeholder="Enter your email address" />
  
            <label>Password</label>
            <input type="password" placeholder="Enter your password" />
  
            <div className="actions">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#">Forgot Password?</a>
            </div>
  
            <button type="submit" className="login-button">Login</button>
  
            <p>or continue with</p>
            <div className="social-buttons">
              <button className="social-btn facebook">Facebook</button>
              <button className="social-btn google">Google</button>
              <button className="social-btn github">GitHub</button>
            </div>
          </form> */}
      </div>
    </div>
  );
};

export default LoginPage;
