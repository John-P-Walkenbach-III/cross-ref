import React from 'react';

function Spinner({ message }) {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
}

export default Spinner;