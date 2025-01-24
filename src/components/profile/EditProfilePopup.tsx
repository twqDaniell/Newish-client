import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Avatar from "@mui/material/Avatar";
import { useAppContext } from "../../contexts/AppContext.ts";
import { userService } from "../../services/users-service.ts";
import "./EditProfilePopup.css";

export default function EditProfilePopup({ openPopup, setOpenPopup }) {
  const { user, setUser, setSnackbar } = useAppContext();
  const [name, setName] = useState(user.username);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [open, setOpen] = React.useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<
    string | null
  >(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setOpenPopup(false);
    setName(user.username);
    setPhoneNumber(user.phoneNumber || "");
    setProfilePicture(null);
    setProfilePicturePreview(null);
    setIsFormValid(false);
    setPhoneError("");
  };

  useEffect(() => {
    if (openPopup) {
      handleOpen();
    }
  }, [openPopup]);

  useEffect(() => {
    // Check form validity
    const isValid =
      name.length > 0 &&
      phoneNumber.match(/^05\d{8}$/) && // Regex for '05********'
      (profilePicture?.name.length > 0 || user?.profilePicture.length > 0); // Ensure picture exists
    setIsFormValid(isValid);

    // Check phone number validity
    if (!phoneNumber.match(/^05\d{8}$/) && phoneNumber.length > 0) {
      setPhoneError("Please enter a valid phone number");
    } else {
      setPhoneError("");
    }
  }, [name, phoneNumber, profilePicture, user?.profilePicture]);

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPhoneNumber(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("username", name);
      formData.append("phoneNumber", phoneNumber);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      const res = await userService.updateUser(user._id, formData);

      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        type: "success",
      });
      setUser({
        ...user,
        username: name,
        phoneNumber,
        profilePicture: res.user.profilePicture,
      });
      handleClose();
    } catch (error) {
      console.error("Error updating user:", error);
      setSnackbar({
        open: true,
        message: "Error updating user: " + error.message,
        type: "error",
      });
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Profile
          </Typography>

          <Box sx={{ textAlign: "center", marginBottom: "20px" }}>
            <Avatar
              src={
                user?.profilePicture.startsWith("http")
                  ? user?.profilePicture
                  : `${
                      profilePicturePreview ||
                      `${
                        process.env.REACT_APP_BASE_PHOTO_URL
                      }/${user?.profilePicture?.replace(/\\/g, "/")}`
                    }`
              }
              alt="Profile"
              sx={{
                width: 90,
                height: 90,
                margin: "0 auto",
                backgroundColor: "#f0f0f0",
              }}
              imgProps={{ referrerPolicy: "no-referrer" }}
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
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleProfilePictureChange}
              />
            </Button>
          </Box>

          <div className="editForm">
            <label>Name*</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="inputField"
              required
            />

            <label>
              <div className="phoneWithError">
                <span>Phone Number*</span>
                {phoneError && <p className="error-message">{phoneError}</p>}
              </div>
            </label>
            <input
              type="text"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className="inputField"
              required
            />
          </div>

          <Button
            sx={{ textTransform: "none" }}
            variant="contained"
            className="saveEditButton"
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            Save
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
