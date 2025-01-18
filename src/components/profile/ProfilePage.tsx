import React from "react";
import "./ProfilePage.css";
import loginIllustration from "../../assets/login_illustration.png";
import { useAppContext } from "../../contexts/AppContext.ts";

const ProfilePage = () => {
  const { user } = useAppContext();

  return (
    <div className="containerProfile">
      <div className="leftSide">
        <img className="profilePic" src={`http://localhost:3002/${user.profilePicture.replace(/\\/g, '/')}`}
        ></img>
      </div>
      <div className="RightSide">
        <h1>{user.name}</h1>
        <p>
          {user.email}
        </p>
        <p>
          {user.phoneNumber}
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
