import React, { useState, useEffect } from 'react'
import {Routes, Route} from "react-router-dom"
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile';
import CrossFacts from './pages/CrossFacts';
import Prayers from './pages/Prayers';
import Media from './pages/Media';
import AboutUs from './pages/AboutUs';
import BibleReader from './pages/BibleReader';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import AddPost from './pages/AddPost';
import EditPost from './pages/EditPost';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import PrayerSuggestions from './pages/PrayerSuggestions';
import AdminRoute from './components/AdminRoute';
import './App.css'
import Games from './pages/Games';
import BibleQuiz from './pages/games/play/BibleQuiz';
import FillInTheBlank from './pages/games/play/FillInTheBlank';
import ChatRoom from './pages/ChatRoom';

function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setUserProfile({ uid: currentUser.uid, ...docSnap.data() });
        } else {
          // If user doc doesn't exist, create it with a default 'user' role
          const newUserProfile = {
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            lastLogin: serverTimestamp(),
            role: 'user'
          };
          await setDoc(userRef, newUserProfile);
          setUserProfile({ uid: currentUser.uid, ...newUserProfile });
        }
      }
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <div>
      <main>
        <Routes>
          {/* Routes that require login and have the main layout */}
          <Route element={<ProtectedRoute user={user}><Layout user={user} userProfile={userProfile} /></ProtectedRoute>}>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/profile" element={<Profile user={user} userProfile={userProfile} />} />
            <Route path="/bible-reader" element={<BibleReader user={user} />} />
            <Route path="/cross-facts" element={<CrossFacts />} />
            <Route path="/prayers" element={<Prayers user={user} />} />
            <Route path="/media" element={<Media />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/blog" element={<Blog userProfile={userProfile} />} />
            <Route path="/blog/:postId" element={<BlogPost user={user} userProfile={userProfile} />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/play/bible-quiz" element={<BibleQuiz />} />
            <Route path="/games/play/fill-in-the-blank" element={<FillInTheBlank />} />
            <Route path="/chat" element={<ChatRoom user={user} />} />

          </Route>

          {/* Admin-specific routes */}
          <Route path="/admin" element={<AdminRoute userProfile={userProfile}><Layout user={user} userProfile={userProfile} /></AdminRoute>}>
            <Route path="add-post" element={<AddPost />} />
            <Route path="edit-post/:postId" element={<EditPost />} />
            <Route path="prayer-suggestions" element={<PrayerSuggestions />} />
          </Route>

          {/* Standalone Login Route */}
          <Route path="/login" element={<Login user={user} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
