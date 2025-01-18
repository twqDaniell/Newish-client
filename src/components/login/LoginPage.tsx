import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import loginIllustration from "../assets/login_illustration.png";
import logo from "../../assets/logo.png";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import { Button, Box } from "@mui/material";
import { authService } from "../../services/auth-service.ts";
import { Snackbar, Alert } from "@mui/material";

const LoginPage = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    try {
      event.preventDefault();
      const response = await authService.login({ email, password });
      console.log("Logged in:", response);
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error.response.data);
      setSnackbarMessage("Login failed: " + error.response.data);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
          <p>
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
            >
              <GoogleIcon />
            </Button>
          </div>
        </form>

        {/* Snackbar Component */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000} // Snackbar will auto-close in 4 seconds
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default LoginPage;
