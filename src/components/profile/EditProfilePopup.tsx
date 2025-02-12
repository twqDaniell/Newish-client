import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Avatar from "@mui/material/Avatar";
import { useAppContext } from "../../contexts/AppContext.ts";
import { userService } from "../../services/users-service.ts";
import "./EditProfilePopup.css";

interface EditProfilePopupProps {
  openPopup: boolean;
  setOpenPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProfilePopup: React.FC<EditProfilePopupProps> = ({ openPopup, setOpenPopup }) => {
  const { user, setUser, setSnackbar } = useAppContext();
  const [name, setName] = useState<string>(user.username);
  const [phoneNumber, setPhoneNumber] = useState<string>(user.phoneNumber || "");
  const [open, setOpen] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<string>("");
  const apiUrl = window.ENV?.BASE_PHOTO_URL || process.env.REACT_APP_BASE_PHOTO_URL;

  const handleOpen = (): void => setOpen(true);

  const handleClose = (): void => {
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
    const validName = name.trim().length > 0;
    const validPhone = /^05\d{8}$/.test(phoneNumber);
    const hasPicture =
      profilePicture !== null ||
      (user?.profilePicture && user.profilePicture.length > 0);
  
    const isChanged =
      name !== user.username ||
      phoneNumber !== (user.phoneNumber || "") ||
      profilePicture !== null;
  
    setIsFormValid(validName && validPhone && hasPicture && isChanged);
  
    if (phoneNumber.length > 0 && !validPhone) {
      setPhoneError("Please enter a valid phone number");
    } else {
      setPhoneError("");
    }
  }, [name, phoneNumber, profilePicture, user.username, user.phoneNumber, user.profilePicture]);
  

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      const file: File = e.target.files[0];
      setProfilePicture(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.target.value;
    if (/^\d*$/.test(value)) {
      setPhoneNumber(value);
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
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
    } catch (error: any) {
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
                !profilePicturePreview
                  ? user?.profilePicture.startsWith("http")
                    ? user?.profilePicture
                    : `${profilePicturePreview || `${apiUrl}/${user?.profilePicture?.replace(/\\/g, "/")}`}`
                  : profilePicturePreview
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
              <input type="file" accept="image/*" hidden onChange={handleProfilePictureChange} />
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

export default EditProfilePopup;