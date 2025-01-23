import React, { use, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import loginIllustration from "../assets/login_illustration.png";
import logo from "../../assets/logo.png";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import { Button, Box } from "@mui/material";
import { authService } from "../../services/auth-service.ts";
import { Snackbar, Alert } from "@mui/material";
import User, { useAppContext } from "../../contexts/AppContext.ts";

const LoginPage = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { snackbar, setSnackbar } = useAppContext();
  const { user, setUser, loadingUser } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingUser && user) {
      navigate("/home"); // Redirect only after loadingUser is complete
    }
  }, [loadingUser, user, navigate]);

  const handleLogin = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      const response = await authService.login({ email, password });
      setUser({
        _id: response._id,
        username: response.username,
        email: response.email,
        phoneNumber: response.phoneNumber,
        profilePicture: response.profilePicture,
        soldCount: response.soldCount,
        googleId: null,
        postsCount: response.postsCount,
      });
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      navigate("/home");
    } catch (error) {
      setSnackbar({
        ...snackbar,
        open: true,
        message: "Login failed: " + error.response?.data || error.message,
        type: "error",
      });
    }
  };

  const handleGoogleLogin = async () => {
    window.location.href = "http://localhost:3002/auth/google";
  };

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
          <p onClick={() => navigate("/register")}>
            If you don’t have an account, <a href="#">Register here!</a>
          </p>

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
          />

          <div className="forgotPassword">
            <a href="#">Forgot Password?</a>
          </div>

          <button className="login-button" onClick={handleLogin}>
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
              onClick={handleGoogleLogin}
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
