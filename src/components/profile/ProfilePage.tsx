import React, { useEffect } from "react";
import "./ProfilePage.css";
import { useAppContext } from "../../contexts/AppContext.ts";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import EditIcon from "@mui/icons-material/Edit";
import PostsIcon from "@mui/icons-material/PostAdd";
import CheckIcon from "@mui/icons-material/Checklist";
import EditProfilePopup from "./EditProfilePopup.tsx";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import ProductCard from "../home/ProductCard/ProductCard.tsx";
import { usePostContext } from "../../contexts/PostsContext.ts";

const ProfilePage = () => {
  const { user, loadingUser, isGoogle, setBuyOrSell } = useAppContext();
  const { sellPosts } = usePostContext();
  const [openEditPopup, setOpenEditPopup] = React.useState(false);
  const apiUrl = window.ENV?.BASE_PHOTO_URL || process.env.REACT_APP_BASE_PHOTO_URL;
  const navigate = useNavigate();

  useEffect(() => {
    setBuyOrSell("sell");
  }, []);

  useEffect(() => {
    if (!loadingUser && !user) {
      navigate("/");
      return;
    }
  }, [loadingUser]);

  return (
    <div>
    { user && (
      <div className="idCardContainer">
        <div className="idCard">
          <div className="idCardHeader">
            <h2>MY PROFILE CARD</h2>
          </div>
          <div className="idCardBody">
            <div className="profilePicContainer">
              <img
                className="profilePic"
                referrerPolicy="no-referrer"
                src={
                  user?.profilePicture.startsWith("http")
                    ? user?.profilePicture
                    : `${
                      apiUrl
                      }/${user?.profilePicture?.replace(/\\/g, "/")}`
                }
                alt="Profile"
              />
            </div>
            <div className="userDetails">
              <h1>{user.username}</h1>
              <div className="detailRow">
                <EmailIcon className="icon" />
                <span>{user.email}</span>
              </div>
              <div className="detailRow">
                <PhoneIcon className="icon" />
                <span>{user.phoneNumber || "Please update phone number"}</span>
              </div>
              <div className="detailRow">
                <PostsIcon className="icon" />
                <span>{user.postsCount} products up right now</span>
              </div>
              <div className="detailRow">
                <CheckIcon className="icon" />
                <span>{user.soldCount} products sold</span>
              </div>
            </div>
          </div>
          <div className="idCardFooter">
            <Button
              className="editProfileButton"
              onClick={() => setOpenEditPopup(true)}
            >
              <EditIcon />
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="productContainer">
          <h2>On Sale Right Now</h2>
          {sellPosts.length > 0 ? <div className="productList">
            {sellPosts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
            </div> :
            <h3 className="productList">Nothing up right now</h3>
          }
        </div>
      </div>)}
      {openEditPopup && 
        <EditProfilePopup
          openPopup={openEditPopup}
          setOpenPopup={setOpenEditPopup}
        />}
      </div>
  );
};

export default ProfilePage;
