import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import logo from "../../assets/logo.png";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import { Button, Avatar, Box } from "@mui/material";
import { authService } from "../../services/auth-service.ts";
import { useAppContext } from "../../contexts/AppContext.ts";

const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [profilePicture, setProfilePicture] = useState<File | null>(null); // Store the file
    const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
    const { snackbar, setSnackbar, user, loadingUser } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
      if (!loadingUser && user) {
        navigate("/home");
      }
    } , [loadingUser]);
  
    const handleSnackbarClose = () => {
      setSnackbar({ ...snackbar, open: false });
    };
  
    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setProfilePicture(file); // Store the file for submission
  
        // Generate preview
        setProfilePicturePreview(URL.createObjectURL(file));
      }
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        // Prepare form data
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("username", name);
        formData.append("phoneNumber", phoneNumber);
        if (profilePicture) {
          formData.append("profilePicture", profilePicture); // Append the file
        }
  
        await authService.register(formData); // Updated service call
        setSnackbar({ ...snackbar, open: true, message: "Registration successful!", type: "success" });
        navigate("/");
      } catch (error) {
        console.error("Registration failed:", error.response?.data || error.message);
        setSnackbar({ ...snackbar, open: true, message: "Registration failed: " + (error.response?.data || error.message), type: "error" });
      }
    };
  
    return (
      <div className="login-page">
        {/* Left Section */}
        <div className="left-section">
          <div className="content">
            <img src={logo} alt="Logo" className="illustration" />
          </div>
        </div>
  
        {/* Right Section */}
        <div className="right-section">
          <form className="register-form" onSubmit={handleSubmit}>
            <h2 style={{ marginTop: "0" }}>Sign Up</h2>
  
            {/* Profile Picture Upload */}
            <Box sx={{ textAlign: "center", marginBottom: "20px" }}>
              <Avatar
                src={profilePicturePreview || ""}
                alt="Profile"
                sx={{
                  width: 90,
                  height: 90,
                  margin: "0 auto",
                  backgroundColor: "#f0f0f0",
                }}
              >
                {!profilePicturePreview && "?"} {/* Show placeholder if no picture */}
              </Avatar>
              <Button
                variant="text"
                component="label"
                sx={{
                  marginTop: 1,
                  color: "#FF5722",
                  textTransform: "none",
                  fontWeight: "bold",
                }}
                style={{ fontSize: "10px" }}
              >
                Upload Profile Picture
                <input type="file" accept="image/*" hidden onChange={handleProfilePictureChange} />
              </Button>
            </Box>
  
            {/* Form Fields */}
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
  
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
  
            <label>Phone Number</label>
            <input
              type="number"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
  
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
  
            <button className="register-button" type="submit">
              Join the community
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default RegisterPage;
  
