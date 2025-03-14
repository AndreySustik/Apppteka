import React from "react";

function ConfirmationModal({ isOpen, onClose, onConfirm, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onConfirm}>Да</button>
          <button onClick={onClose}>Отмена</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;