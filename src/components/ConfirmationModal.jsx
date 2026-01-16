import React from 'react';

function ConfirmationModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-content confirmation-modal">
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="confirmation-actions">
          <button onClick={onCancel} className="delete-button">
            Cancel
          </button>
          <button onClick={onConfirm} className="confirm-delete-button">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;