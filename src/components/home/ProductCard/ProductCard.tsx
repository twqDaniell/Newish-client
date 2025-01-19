import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import loginIllustration from "../../../assets/login_illustration.png";
import "./ProductCard.css";
import { likePost } from "../../../services/posts-service.ts";
import { useAppContext } from "../../../contexts/AppContext.ts";
import { usePostContext } from "../../../contexts/PostsContext.ts";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ConfirmationPopup from "../../ConfirmationPopup/ConfirmationPopup.tsx";
import { deletePost } from "../../../services/posts-service.ts";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import Box from "@mui/material/Box";
import ImageModal from "../ImageModal/ImageModal.tsx";

export default function ProductCard({ product }) {
  const { user, buyOrSell, setSnackbar } = useAppContext();
  const { posts, setPosts } = usePostContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  const formatDate = (dateTime) => {
    const date = new Date(dateTime);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  const handleLike = async (postId) => {
    if (!user) {
      alert("You need to be logged in to like a post.");
      return;
    }

    try {
      const response = await likePost(postId, user.id);
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            const hasLiked =
              post.likes.findIndex((like) => like === user.id) !== -1;

            if (hasLiked) {
              return {
                ...post,
                likes: post.likes.filter((like) => like !== user.id),
              };
            } else {
              return {
                ...post,
                likes: [...post.likes, user.id],
              };
            }
          }

          return post;
        })
      );
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const onEdit = () => {
    console.log("Edit");
  };

  const onDelete = () => {
    setConfirmOpen(true);
  };

  const handleCloseImage = () => setPhotoModalOpen(false);

  const onConfirmDelete = async () => {
    try {
      await deletePost(product._id);
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== product._id)
      );

      setSnackbar({
        open: true,
        message: "Post deleted successfully",
        type: "success",
      });
      setConfirmOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete post",
        type: "error",
      });
    }
  };

  return (
    <div>
      <Card
        sx={{
          maxWidth: 345,
          backgroundColor: "#ffffff",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          borderRadius: "10px",
        }}
      >
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              <img
                style={{ width: "40px", height: "40px" }}
                src={`http://localhost:3002/${product.sender.profilePicture.replace(
                  /\\/g,
                  "/"
                )}`}
              ></img>
            </Avatar>
          }
          action={
            buyOrSell === "sell" && (
              <IconButton aria-label="settings" onClick={handleOpenMenu}>
                <MoreVertIcon />
              </IconButton>
            )
          }
          title={product.title}
          subheader={formatDate(product.createdAt)}
        />
        <div
          onClick={() => setPhotoModalOpen(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: "relative",
            cursor: "pointer",
            overflow: "hidden",
          }}
        >
          {/* CardMedia */}
          <CardMedia
            component="img"
            height="250"
            image={`http://localhost:3002/${product.picture.replace(
              /\\/g,
              "/"
            )}`}
            alt={product.title}
            sx={{
              transition: "0.3s ease",
              filter: hovered ? "brightness(70%)" : "brightness(100%)", // Overlay effect
            }}
          />

          {/* Icon overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              opacity: hovered ? 1 : 0,
              transition: "0.3s ease",
              backgroundColor: hovered ? "rgba(0, 0, 0, 0.2)" : "transparent",
            }}
          >
            <IconButton
              sx={{
                color: "white",
                fontSize: "50px",
              }}
            >
              <ZoomInIcon fontSize="inherit" />
            </IconButton>
          </Box>
        </div>
        <CardContent>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {product.content}
          </Typography>
          <div className="prices">
            <Typography
              variant="body2"
              sx={{ color: "#e05a5a", fontSize: "15px" }}
              className="price"
            >
              Original Price:{" "}
              <s style={{ fontWeight: "bold" }}>{product.oldPrice}$</s>
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#6c945f", fontSize: "15px" }}
              className="price"
            >
              New Price:{" "}
              <a style={{ fontWeight: "bold" }}>{product.newPrice}$</a>
            </Typography>
          </div>
        </CardContent>
        <CardActions disableSpacing>
          <div className="likeConunt">
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {product.likes?.length}
            </Typography>
            <IconButton
              aria-label="add to favorites"
              onClick={() => handleLike(product._id)}
            >
              {product.likes?.findIndex((like) => like == user.id) == -1 ? (
                <FavoriteIcon />
              ) : (
                <FavoriteIcon style={{ color: "#EE297B" }} />
              )}
            </IconButton>
          </div>
          <div className="likeConunt">
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {product.comments?.length}
            </Typography>
            <IconButton aria-label="add to favorites">
              <CommentIcon />
            </IconButton>
          </div>
        </CardActions>
      </Card>

      {/* Menu Component */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            onEdit();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            onDelete();
          }}
        >
          Delete
        </MenuItem>
      </Menu>

      <ConfirmationPopup
        open={confirmOpen}
        message="Are you sure you want to delete this post?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={onConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      ></ConfirmationPopup>

      <ImageModal
        open={photoModalOpen}
        title={product.title}
        picture={`http://localhost:3002/${product.picture.replace(/\\/g,"/")}`}
        onClose={handleCloseImage}
      ></ImageModal>
    </div>
  );
}
