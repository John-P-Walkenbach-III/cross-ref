import React, { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';

import crossImage from '../assets/cross.png'; // Make sure this path is correct
function Home({ user }) {
  const [verseData, setVerseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchVerse = async () => {
      try {
        setLoading(true);
        setIsSaved(false); // Reset save status for new verse
        const response = await fetch('https://beta.ourmanna.com/api/v1/get?format=json&order=random');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setVerseData(data.verse.details);
      } catch (error) {
        console.error("Failed to fetch verse:", error);
        // You could set a default verse here in case of an error
      } finally {
        setLoading(false);
      }
    };

    fetchVerse();
  }, []); // Empty dependency array means this runs once on mount

  const handleSaveVerse = async () => {
    if (!user || !verseData) return;

    const userDocRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userDocRef, {
        savedVerses: arrayUnion({
          ...verseData,
          savedAt: new Date() // Use client-side timestamp
        })
      });
      setIsSaved(true);
      // Show success toast
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 2000); // Hide after 2 seconds
    } catch (error) {
      console.error("Error saving verse: ", error);
    }
  };
  return (
    <div>
      {showSaveSuccess && <div className="toast-notification">Verse Saved!</div>}
      <div className="title-container">
        <span className="title-font">Cross</span>
        <img src={crossImage} alt="Cross" className="title-cross" />
        <span className="title-font">Reference</span>
      </div>
      <h2>Welcome, {user?.displayName}!</h2>

      <div className="verse-container">
        {loading ? <p>Loading verse...</p> : verseData && (
          <>
            <blockquote className="verse-text">"{verseData.text}"</blockquote>
            <cite className="verse-reference">- {verseData.reference}</cite>
            <div className="verse-actions">
              <button onClick={handleSaveVerse} disabled={isSaved}>
                {isSaved ? 'Saved' : 'Save Verse'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;