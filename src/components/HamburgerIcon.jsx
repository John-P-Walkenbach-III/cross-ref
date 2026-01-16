import React from 'react';

function HamburgerIcon({ isOpen, onClick }) {
  return (
    <button className={`hamburger-icon ${isOpen ? 'open' : ''}`} onClick={onClick} aria-label="Toggle menu">
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
}

export default HamburgerIcon;