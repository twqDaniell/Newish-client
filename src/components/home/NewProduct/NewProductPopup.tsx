import React, { useState } from "react";
import "./NewProductPopup.css"; // Link the updated CSS

const NewProductPopup = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [picture, setPicture] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [description, setDescription] = useState("");
  const [timesWorn, setTimesWorn] = useState("0");

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPicture(file);
      setPicturePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      picture,
      name,
      originalPrice,
      newPrice,
      description,
      timesWorn,
    };

    console.log("Form Submitted:", formData);
    onClose();
  };

  if (!open) return null; // Don't render if the popup is closed

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="popup-close-button" onClick={onClose}>
          &times;
        </button>
        <h2 className="popup-title">Add New Product</h2>
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
              Name (Title)
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
                  2+
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
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewProductPopup;
