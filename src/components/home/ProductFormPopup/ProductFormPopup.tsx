import React, { useEffect, useState } from "react";
import "./ProductFormPopup.css";
import { createPost, updatePost } from "../../../services/posts-service.ts";
import { useAppContext } from "../../../contexts/AppContext.ts";
import { usePostContext } from "../../../contexts/PostsContext.ts";
import { Post } from "../../../services/posts-service.ts";

const ProductFormPopup = ({
  open,
  onClose,
  isEdit,
  postToEdit,
}: {
  open: boolean;
  onClose: () => void;
  isEdit: boolean;
  postToEdit: Post;
}) => {
  const { setSellPosts } = usePostContext();
  const { setSnackbar, user } = useAppContext();
  const [picture, setPicture] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [description, setDescription] = useState("");
  const [timesWorn, setTimesWorn] = useState("0");
  const [warningMessage, setWarningMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const apiUrl = window.ENV?.BASE_PHOTO_URL || process.env.REACT_APP_BASE_PHOTO_URL;

  useEffect(() => {
    const fetchPicture = async () => {
      if (postToEdit.picture) {
        const response = await fetch(
          `${apiUrl}/${postToEdit.picture.replace(
            /\\/g,
            "/"
          )}`
        );
        const blob = await response.blob();
        const file = new File([blob], "existing-picture.jpg", {
          type: blob.type,
        });
        setPicture(file);
      }
    };

    if (isEdit) {
      setName(postToEdit.title);
      setCity(postToEdit.city);
      setOriginalPrice(postToEdit.oldPrice);
      setNewPrice(postToEdit.newPrice);
      setDescription(postToEdit.content);
      setTimesWorn(postToEdit.timesWorn.toString());
      setPicturePreview(
        `${apiUrl}/${postToEdit.picture.replace(
          /\\/g,
          "/"
        )}`
      );
      fetchPicture();
    } else {
      setName("");
      setCity("");
      setOriginalPrice("");
      setNewPrice("");
      setDescription("");
      setTimesWorn("0");
      setPicture(null);
      setPicturePreview(null);
    }
  }, [isEdit, postToEdit]);

  useEffect(() => {
    const isValid =
      name.length > 0 &&
      city.length > 0 &&
      description.length > 0 &&
      originalPrice.toString().length > 0 &&
      newPrice.toString().length > 0 &&
      picturePreview &&
      Number(originalPrice) >= Number(newPrice);

      console.log("Form Validation Check:" + isValid);

    setIsFormValid(isValid);

    if (Number(originalPrice) < Number(newPrice)) {
      setWarningMessage("Original price cannot be lower than the new price.");
    } else {
      setWarningMessage("");
    }
  }, [name, city, description, originalPrice, newPrice, picture]);

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPicture(file);
      setPicturePreview(URL.createObjectURL(file));
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 500) {
      setDescription(e.target.value);
    }
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setter(value);
    }
  };

  const uploadPost = async () => {
    try {
      const formData = new FormData();
      formData.append("title", name);
      formData.append("content", description);
      formData.append("oldPrice", originalPrice);
      formData.append("newPrice", newPrice);
      formData.append("city", city);
      formData.append("timesWorn", timesWorn);
      formData.append("sender", user._id);

      if (picture) {
        formData.append("picture", picture); // Append the file
      }

      console.log(user._id);

      // Call createPost with FormData
      const newPost = await createPost(formData);
      setSellPosts((prevPosts) => [
        ...prevPosts,
        {
          ...newPost.data,
          sender: {
            _id: user._id,
            username: user.username,
            profilePicture: user.profilePicture,
            phoneNumber: user.phoneNumber,
          },
        },
      ]);

      handleClose();
      setSnackbar({
        open: true,
        message: "Post created successfully",
        type: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to create post" + err,
        type: "error",
      });
    }
  };

  const editPost = async () => {
    try {
      const formData = new FormData();
      formData.append("title", name);
      formData.append("content", description);
      formData.append("oldPrice", originalPrice);
      formData.append("newPrice", newPrice);
      formData.append("city", city);
      formData.append("timesWorn", timesWorn);
      formData.append("sender", user._id);

      if (picture) {
        formData.append("picture", picture);
      }

      const newPost = await updatePost(postToEdit._id, formData);
      setSellPosts((prevPosts) => {
        const index = prevPosts.findIndex(
          (post) => post._id === postToEdit._id
        );
        const newPosts = [...prevPosts];
        newPosts[index] = newPost.data;
        newPosts[index].sender = {
          _id: user._id,
          username: user.username,
          profilePicture: user.profilePicture,
          phoneNumber: user.phoneNumber,
        };
        return newPosts;
      });
      handleClose();
      setSnackbar({
        open: true,
        message: "Post updated successfully",
        type: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to update post" + err,
        type: "error",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit) {
      await editPost();
    } else {
      await uploadPost();
    }
  };

  const handleClose = () => {
    onClose();

  }

  if (!open) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="popup-close-button" onClick={handleClose}>
          &times;
        </button>
        <h2 className="popup-title">{isEdit ? "Edit Product" : "Add new product"}</h2>
        <form className="popup-form" onSubmit={handleSubmit}>
          <div className="popup-left">
            <div className="picture-preview">
              {picturePreview ? (
                <img src={picturePreview} alt="Preview" />
              ) : (
                <span>No Image</span>
              )}
            </div>
            <label className="file-upload">
              Upload Picture
              <input
                type="file"
                accept="image/*"
                onChange={handlePictureChange}
                required
              />
            </label>
          </div>

          <div className="popup-right">
            <label>
              Title*
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label>
              Original Price*
              <input
                type="text"
                value={originalPrice}
                onChange={(e) => handlePriceChange(e, setOriginalPrice)}
                required
              />
            </label>

            <label className="newPriceLabel">
              <div>
                <span className="labelText">New Price* </span>
                {warningMessage && <span className="warning-message">{warningMessage}</span>}
              </div>

              <input
                type="text"
                value={newPrice}
                onChange={(e) => handlePriceChange(e, setNewPrice)}
                required
              />
            </label>

            <label>
              Pickup City*
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </label>

            <label>
              Description (max 500 chars)*
              <textarea
                value={description}
                onChange={handleDescriptionChange}
                rows={3}
                required
              />
              <small>{500 - description.length} characters remaining</small>
            </label>

            <label>
              How Many Times Used?
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    value="0"
                    checked={timesWorn === "0"}
                    onChange={(e) => setTimesWorn(e.target.value)}
                  />
                  0 (Brand New)
                </label>
                <label>
                  <input
                    type="radio"
                    value="1"
                    checked={timesWorn === "1"}
                    onChange={(e) => setTimesWorn(e.target.value)}
                  />
                  1
                </label>
                <label>
                  <input
                    type="radio"
                    value="2"
                    checked={timesWorn === "2"}
                    onChange={(e) => setTimesWorn(e.target.value)}
                  />
                  2
                </label>
              </div>
            </label>
          </div>
        </form>

        <div className="popup-actions">
          <button type="button" className="cancel-button" onClick={handleClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={!isFormValid}
            onClick={handleSubmit}
          >
            {isEdit ? "Save Changes" : "Upload Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFormPopup;
