import React from "react";
import "./ProfilePage.css";
import loginIllustration from "../../assets/login_illustration.png";
import { useAppContext } from "../../contexts/AppContext.ts";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import EditIcon from "@mui/icons-material/Edit";
import PostsIcon from "@mui/icons-material/PostAdd";
import LikeIcon from "@mui/icons-material/Favorite";
import CheckIcon from "@mui/icons-material/Checklist";
import EditProfilePopup from "./EditProfilePopup.tsx";
import { Button } from "antd";

const ProfilePage = () => {
  const { user } = useAppContext();
  const [openEditPopup, setOpenEditPopup] = React.useState(false);

  return (
    <div className="containerProfile">
      <div className="leftSide">
        <img
          className="profilePic"
          src={`http://localhost:3002/${user.profilePicture.replace(
            /\\/g,
            "/"
          )}`}
        ></img>
      </div>
      <div className="RightSide">
        <h1>{user.name}</h1>
        <div className="detailRow">
          <EmailIcon sx={{ width: "20px", color: "#EE297B" }}></EmailIcon>
          <div className="detail">{user.email}</div>
        </div>
        <div className="detailRow">
          <PhoneIcon sx={{ width: "20px", color: "#EE297B" }}></PhoneIcon>
          <div className="detail">{user.phoneNumber}</div>
        </div>
        <div className="detailRow">
          <PostsIcon sx={{ width: "20px", color: "#EE297B" }}></PostsIcon>
          <div className="detail">4 products up right now</div>
        </div>
        <div className="detailRow">
          <CheckIcon sx={{ width: "20px", color: "#EE297B" }}></CheckIcon>
          <div className="detail">5 products sold</div>
        </div>
        <div className="detailRow">
          <LikeIcon sx={{ width: "20px", color: "#EE297B" }}></LikeIcon>
          <div className="detail">55 likes earned</div>
        </div>
        <Button className="editProfileButton" onClick={() => setOpenEditPopup(true)}>
          <EditIcon></EditIcon>
          Edit Profile
        </Button>
      </div>

      <EditProfilePopup openPopup={openEditPopup} setOpenPopup={setOpenEditPopup}></EditProfilePopup>
    </div>
  );
};

export default ProfilePage;
