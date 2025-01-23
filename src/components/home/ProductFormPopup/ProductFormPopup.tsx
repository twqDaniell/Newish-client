import React, { useEffect, useState } from "react";
import "./ProductFormPopup.css"; // Link the updated CSS
import { createPost, updatePost } from "../../../services/posts-service.ts";
import { useAppContext } from "../../../contexts/AppContext.ts";
import { usePostContext } from "../../../contexts/PostsContext.ts";
import { Post } from "../../../services/posts-service.ts";

const ProductFormPopup = ({ open, onClose, isEdit, postToEdit }: { open: boolean; onClose: () => void, isEdit: boolean, postToEdit: Post }) => {
  const { posts, setPosts } = usePostContext();
  const { setSnackbar, user } = useAppContext();
  const [picture, setPicture] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [description, setDescription] = useState("");
  const [timesWorn, setTimesWorn] = useState("0");

  useEffect(() => {
    if (isEdit) {
        setName(postToEdit.title);
        setCity(postToEdit.city);
        setOriginalPrice(postToEdit.oldPrice);
        setNewPrice(postToEdit.newPrice);
        setDescription(postToEdit.content);
        setTimesWorn(postToEdit.timesWorn);
        setPicturePreview(`http://localhost:3002/${postToEdit.picture.replace(/\\/g,"/")}`);
        
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
  }, []);

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPicture(file);
      setPicturePreview(URL.createObjectURL(file));
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
      setPosts((prevPosts) => [...prevPosts, { ...newPost.data, sender: { _id: user._id, username: user.name, profilePicture: user.profilePicture, phoneNumber: user.phoneNumber } }]);

      onClose();
      setSnackbar({ open: true, message: "Post created successfully", type: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to create post" + err, type: "error" });
    }
  }

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
      setPosts(prevPosts => {
          const index = prevPosts.findIndex(post => post._id === postToEdit._id);
          const newPosts = [...prevPosts];
          newPosts[index] = newPost.data;
          newPosts[index].sender = { _id: user._id, username: user.name, profilePicture: user.profilePicture, phoneNumber: user.phoneNumber };
          return newPosts;
        }
      )
      onClose();
      setSnackbar({ open: true, message: "Post updated successfully", type: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to update post" + err, type: "error" });
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (isEdit) {
      editPost();
    } else {
      uploadPost();
    }
  };  

  if (!open) return null; // Don't render if the popup is closed

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="popup-close-button" onClick={onClose}>
          &times;
        </button>
        <h2 className="popup-title">{isEdit ? "Edit Product" : "Add new product"}</h2>
        <form className="popup-form" onSubmit={handleSubmit}>
          {/* Left Side - Picture Upload */}
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
              <input type="file" accept="image/*" onChange={handlePictureChange} />
            </label>
          </div>

          {/* Right Side - Form Fields */}
          <div className="popup-right">
            <label>
              Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label>
              Original Price
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                required
              />
            </label>

            <label>
              New Price
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                required
              />
            </label>

            <label>
              Pickup City
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </label>

            <label>
              Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
              />
            </label>

            <label>
              How Many Times Used?
              <div className="radio-group">
                <label className="radioLabel">
                  <input
                    type="radio"
                    value="0"
                    checked={timesWorn == "0"}
                    onChange={(e) => setTimesWorn(e.target.value)}
                  />
                  0 (Brand New)
                </label>
                <label>
                  <input
                    type="radio"
                    value="1"
                    checked={timesWorn == "1"}
                    onChange={(e) => setTimesWorn(e.target.value)}
                  />
                  1
                </label>
                <label>
                  <input
                    type="radio"
                    value="2"
                    checked={timesWorn == "2"}
                    onChange={(e) => setTimesWorn(e.target.value)}
                  />
                  2
                </label>
              </div>
            </label>
          </div>
        </form>

        {/* Buttons */}
        <div className="popup-actions">
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="submit-button" onClick={handleSubmit}>
            {isEdit ? "Save Changes" : "Upload Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFormPopup;
