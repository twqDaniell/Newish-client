import React from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import loginIllustration from "../assets/login_illustration.png";
import logo from "../../assets/logo.png";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import { Button, Box } from "@mui/material";

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
        <form className="login-form">
          <h2>Sign In</h2>
          <p>
            If you don’t have an account, <a href="#">Register here!</a>
          </p>

          <label>Email</label>
          <input type="email" placeholder="Enter your email address" />

          <label>Password</label>
          <input type="password" placeholder="Enter your password" />

          <div className="forgotPassword">
            <a href="#">Forgot Password?</a>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          <p>or continue with</p>
          <div className="social-buttons">
            <Button
              variant="contained"
              color="primary"
              sx={{
                borderRadius: "50%",
                width: 40,
                height: 40,
                minWidth: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#1877F2", // Facebook Blue
                "&:hover": {
                  backgroundColor: "#145db2",
                },
                marginRight: 2,
              }}
            >
              <FacebookIcon />
            </Button>
            <Button
              variant="contained"
              sx={{
                borderRadius: "50%",
                width: 40,
                height: 40,
                minWidth: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#DB4437", // Google Red
                "&:hover": {
                  backgroundColor: "#c33c2f",
                },
              }}
            >
              <GoogleIcon />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
