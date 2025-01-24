import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import logo from "../../assets/logo.png";
import { Button, Avatar, Box } from "@mui/material";
import { authService } from "../../services/auth-service.ts";
import { useAppContext } from "../../contexts/AppContext.ts";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const { snackbar, setSnackbar, user, loadingUser } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingUser && user) {
      navigate("/home");
    }
  }, [loadingUser, user, navigate]);

  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isPhoneValid = (phone: string) =>
    /^05\d{8}$/.test(phone);

  const isPasswordValid = (password: string) => password.length >= 6;

  const isFormValid =
    name.length > 0 &&
    isEmailValid(email) &&
    isPhoneValid(phoneNumber) &&
    isPasswordValid(password);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("username", name);
      formData.append("phoneNumber", phoneNumber);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      await authService.register(formData);
      setSnackbar({ ...snackbar, open: true, message: "Registration successful!", type: "success" });
      navigate("/");
    } catch (error) {
      setSnackbar({
        ...snackbar,
        open: true,
        message: "Registration failed: " + (error.response?.data || error.message),
        type: "error",
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
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
              {!profilePicturePreview && "?"}
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
            onBlur={() => handleBlur("name")}
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur("email")}
          />

          <label>Phone Number</label>
          <input
            type="text"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            onBlur={() => handleBlur("phoneNumber")}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur("password")}
          />
          {Object.keys(touchedFields).length > 0 && !isFormValid && (
            <span className="error-message-register">
              Make sure all fields are filled correctly.
            </span>
          )}

          <button className="register-button" type="submit" disabled={!isFormValid}>
            Join the community
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
