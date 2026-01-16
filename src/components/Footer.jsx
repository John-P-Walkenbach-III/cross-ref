import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-nav">
          <Link to="/">Home</Link>
          <Link to="/bible-reader">Bible Reader</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/about-us">About Us</Link>
        </div>
        <div className="footer-copyright">
          <p>&copy; {currentYear} Cross-Reference. All Rights Reserved.</p>
          <p>Developed by John P. Walkenbach III</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;