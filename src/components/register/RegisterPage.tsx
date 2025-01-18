import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import logo from "../../assets/logo.png";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import { Button, Snackbar, Alert, Avatar, Box } from "@mui/material";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePictureBase64, setProfilePictureBase64] = useState<string | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Generate preview
      setProfilePicturePreview(URL.createObjectURL(file));

      // Convert to Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setProfilePictureBase64(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", {
      name,
      email,
      phoneNumber,
      password,
      profilePictureBase64,
    });
    setSnackbarMessage("Registration successful!");
    setSnackbarOpen(true);
    navigate("/login");
  };

  return (
    <div className="login-page">
      {/* Left Section */}
      <div className="left-section">
        <div className="content">
          <img
            src={logo}
            alt="Logo"
            className="illustration"
          />
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
              style={{fontSize: "10px"}}
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
                backgroundColor: "#1877F2",
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
                backgroundColor: "#DB4437",
                "&:hover": {
                  backgroundColor: "#c33c2f",
                },
              }}
            >
              <GoogleIcon />
            </Button>
          </div>
        </form>

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default RegisterPage;
