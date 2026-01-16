import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../firebase/firebase.js';
import crossImage from '../assets/cross.png'; // Make sure this path is correct
import Spinner from '../components/Spinner.jsx';

function Login({ user }) {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    // Set a 3-second timeout for dramatic effect
    setTimeout(async () => {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
      } catch (error) {
        console.error("Error signing in with Google", error);
        setIsSigningIn(false); // Reset on error so user can try again
      }
    }, 3000);
  };

  // If user is already logged in, redirect to home page
  if (user) {
    return <Navigate to={from} replace />;
  }

  return (
    isSigningIn ? (
      <Spinner message="Authenticating..." />
    ) : (
      <div>
        <div className="title-container">
          <span className="title-font">Cross</span>
          <img src={crossImage} alt="Cross" className="title-cross" />
          <span className="title-font">Reference</span>
        </div>
        <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      </div>
    )
  );
}

export default Login;