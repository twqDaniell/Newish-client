import React from "react";
import "./ConfirmationPopup.css"; // CSS file for styling

interface ConfirmationPopupProps {
  open: boolean;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  open,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="confirmation-popup-overlay">
      <div className="confirmation-popup-container">
        <p className="confirmation-popup-message">{message}</p>
        <div className="confirmation-popup-actions">
          <button
            className="confirmation-popup-cancel-button"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="confirmation-popup-confirm-button"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
