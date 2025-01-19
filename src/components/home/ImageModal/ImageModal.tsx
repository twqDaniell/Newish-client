import React from "react";
import "./ImageModal.css";

interface ImagePopupProps {
  title: string;
  picture: string;
  open: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImagePopupProps> = ({ title, picture, open, onClose }) => {
  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="image-popup-overlay" onClick={handleOverlayClick}>
      <div className="image-popup-container">
        <button className="image-popup-close" onClick={onClose}>
          &times;
        </button>
        <p className="image-popup-message">{title}</p>
        <img width={"500px"} src={picture} alt={title} />
      </div>
    </div>
  );
};

export default ImageModal;
