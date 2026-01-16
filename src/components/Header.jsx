import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function Header({ userProfile }) {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth).catch((error) => console.error("Logout Error:", error));
    setIsMenuOpen(false); // Close menu on logout
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="app-header">
        <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
          <NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : ''} onClick={closeMenu}>Home</NavLink>
          <NavLink to="/bible-reader" className={({ isActive }) => isActive ? 'active-link' : ''} onClick={closeMenu}>Bible</NavLink>
          <NavLink to="/cross-facts" className={({ isActive }) => isActive ? 'active-link' : ''} onClick={closeMenu}>The Cross</NavLink>
          <NavLink to="/blog" className={({ isActive }) => isActive ? 'active-link' : ''} onClick={closeMenu}>Blog</NavLink>
          <NavLink to="/prayers" className={({ isActive }) => isActive ? 'active-link' : ''} onClick={closeMenu}>Prayers</NavLink>
          <NavLink to="/media" className={({ isActive }) => isActive ? 'active-link' : ''} onClick={closeMenu}>Media</NavLink>
          <NavLink to="/games" className={({ isActive }) => isActive ? 'active-link' : ''} onClick={closeMenu}>Games</NavLink>
          <NavLink to="/chat" className={({ isActive }) => isActive ? 'active-link' : ''} onClick={closeMenu}>Chat</NavLink>
          <NavLink to="/about-us" className={({ isActive }) => isActive ? 'active-link' : ''} onClick={closeMenu}>About Us</NavLink>
          
          {userProfile?.role === 'admin' && (
            <>
              <NavLink to="/admin/add-post" className={({ isActive }) => isActive ? 'active-link' : ''} onClick={closeMenu}>Add Post</NavLink>
              <NavLink to="/admin/prayer-suggestions" className={({ isActive }) => isActive ? 'active-link' : ''} onClick={closeMenu}>Suggestions</NavLink>
            </>
          )}
          
          {user ? (
            <>
              <NavLink to="/profile" className={({ isActive }) => isActive ? 'active-link' : ''} onClick={closeMenu}>Profile</NavLink>
              <a href="#!" onClick={handleLogout} className="logout-link">Logout</a>
            </>
          ) : (
            <NavLink to="/login" className={({ isActive }) => isActive ? 'active-link' : ''} onClick={closeMenu}>Login</NavLink>
          )}
        </nav>

        <button className={`mobile-menu-toggle hamburger-icon ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>
      {isMenuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
    </>
  );
}

export default Header;
