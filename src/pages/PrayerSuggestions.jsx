import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, query, orderBy, doc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';

function PrayerSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const suggestionsCollectionRef = collection(db, 'prayerSuggestions');
        const q = query(suggestionsCollectionRef, orderBy('submittedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const suggestionsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          submittedAt: doc.data().submittedAt.toDate().toLocaleString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
          })
        }));
        setSuggestions(suggestionsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching suggestions: ", err);
        setError("Failed to load prayer suggestions. This could be a permissions issue in your Firestore rules.");
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const handleDelete = async (suggestionId) => {
    if (window.confirm("Are you sure you want to delete this suggestion?")) {
      try {
        await deleteDoc(doc(db, 'prayerSuggestions', suggestionId));
        setSuggestions(suggestions.filter(s => s.id !== suggestionId));
      } catch (err) {
        console.error("Error deleting suggestion: ", err);
        setError("Failed to delete suggestion.");
      }
    }
  };

  const handleApprove = async (suggestion) => {
    if (window.confirm("Are you sure you want to approve this prayer and make it public?")) {
      try {
        // 1. Add the prayer to the public 'publicPrayers' collection
        await addDoc(collection(db, 'publicPrayers'), {
          text: suggestion.suggestion,
          submittedBy: suggestion.submittedBy.name,
          approvedAt: serverTimestamp(),
        });
        // 2. Delete the original suggestion from the 'prayerSuggestions' collection
        await deleteDoc(doc(db, 'prayerSuggestions', suggestion.id));
        // 3. Update the UI by removing the suggestion from the list
        setSuggestions(suggestions.filter(s => s.id !== suggestion.id));
      } catch (err) {
        console.error("Error approving suggestion: ", err);
        setError("Failed to approve the suggestion. Please check the console and Firestore rules.");
      }
    }
  };

  return (
    <div className="text-page-container">
      <h1 className="title-font">Prayer Suggestions</h1>
      <p className="page-description">Review and manage prayer suggestions submitted by users.</p>
      
      {loading && <p>Loading suggestions...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && suggestions.length === 0 && !error && <p>No prayer suggestions have been submitted yet.</p>}

      <ul className="prayer-requests-list">
        {suggestions.map(s => (
          <li key={s.id} className="prayer-request-item">
            <p className="prayer-request-text">{s.suggestion}</p>
            <p className="post-meta" style={{ textAlign: 'left', marginTop: '1rem' }}>
              Submitted by: {s.submittedBy.name} on {s.submittedAt}
            </p>
            <div className="prayer-request-actions">
              <button onClick={() => handleApprove(s)} className="approve-button">Approve</button>
              <button onClick={() => handleDelete(s.id)} className="delete-button">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PrayerSuggestions;