import React from "react";
import "./ProfilePage.css";
import loginIllustration from "../assets/login_illustration.png";

const ProfilePage = () => {
  return (
    <div className="containerProfile">
      <div className="leftSide">
        <img className="profilePic" src={loginIllustration}></img>
      </div>
      <div className="RightSide">
        <h1>Daniel Aradovsky</h1>
        <p>
          daniel.ar.mcl@gmail.com
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
