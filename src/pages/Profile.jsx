import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../firebase/firebase';
import ConfirmationModal from '../components/ConfirmationModal';

function Profile({ user }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [modalState, setModalState] = useState({ isOpen: false, message: '', onConfirm: null });

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
          console.log(userDocSnap.data())
        } else {
          console.log("No such document!");
        }
        setLoading(false);
      };

      fetchUserData();
    }
  }, [user]);

  const openConfirmationModal = (message, onConfirm) => {
    setModalState({ isOpen: true, message, onConfirm });
  };

  const closeConfirmationModal = () => {
    setModalState({ isOpen: false, message: '', onConfirm: null });
  };

  const handleDeleteVerse = (verseToDelete) => {
    openConfirmationModal(
      "Are you sure you want to delete this verse? This action cannot be undone.",
      async () => {
        const userDocRef = doc(db, 'users', user.uid);
        try {
          await updateDoc(userDocRef, { savedVerses: arrayRemove(verseToDelete) });
          setUserData(prevData => ({
            ...prevData,
            savedVerses: prevData.savedVerses.filter(verse => verse.text !== verseToDelete.text || verse.reference !== verseToDelete.reference)
          }));
        } catch (error) {
          console.error("Error deleting verse: ", error);
        }
        closeConfirmationModal();
      }
    );
  };

  const handleEditClick = (verse, index) => {
    setEditingIndex(index);
    setEditingText(verse.note || '');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingText('');
  };

  const handleUpdateNote = async (indexToUpdate) => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);
    const updatedVerses = userData.savedVerses.map((verse, index) => {
      if (index === indexToUpdate) {
        return { ...verse, note: editingText };
      }
      return verse;
    });

    await updateDoc(userDocRef, {
      savedVerses: updatedVerses
    });

    setUserData({ ...userData, savedVerses: updatedVerses });
    handleCancelEdit(); // Reset editing state
  };

  const handleDeletePrayerRequest = (requestToDelete) => {
    openConfirmationModal(
      "Are you sure you want to delete this prayer request?",
      async () => {
        const userDocRef = doc(db, 'users', user.uid);
        try {
          await updateDoc(userDocRef, { prayerRequests: arrayRemove(requestToDelete) });
          setUserData(prevData => ({
            ...prevData,
            prayerRequests: prevData.prayerRequests.filter(req => req.requestedAt !== requestToDelete.requestedAt)
          }));
        } catch (error) {
          console.error("Error deleting prayer request: ", error);
        }
        closeConfirmationModal();
      }
    );
  };

  return (
    <>
      {modalState.isOpen && <ConfirmationModal {...modalState} onCancel={closeConfirmationModal} />}

      <h2 className="subtitle-font">My Profile</h2>
      <div className="profile-header">
        <h3>{user?.displayName || 'Welcome!'}</h3>
        <p>Email: {user?.email}</p>
        {loading ? (
          <p>Loading user details...</p>
        ) : (
          userData && (
          <>
            <p>Last Login: {userData.lastLogin?.toDate().toLocaleString()}</p>
            {userData.lastStudied && (
              <p>
                Last Studied: <Link to={`/bible-reader?ref=${encodeURIComponent(userData.lastStudied)}`} className="last-studied-verse">{userData.lastStudied}</Link>
              </p>
            )}
          </>
          )
        )}
      </div>

      <div className="profile-info">
        <p>Welcome back! You can click your "Last Studied" verse to jump right back in. Below, you can review all your saved verses, edit your personal notes, or remove verses you no longer need.</p>
      </div>

      <div className="saved-verses-section">
        <h3 className="subtitle-font">My Saved Verses</h3>
        {userData?.savedVerses && userData.savedVerses.length > 0 ? (
          <ul className="saved-verses-list">
            {userData.savedVerses.sort((a, b) => b.savedAt.seconds - a.savedAt.seconds).map((verse, index) => (
              <li key={index} className="saved-verse-item">
                {editingIndex === index ? (
                  <>
                    <blockquote className="verse-text">"{verse.text}"</blockquote>
                    <cite className="verse-reference">- {verse.reference}</cite>
                    <textarea
                      className="note-textarea"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                    <div className="verse-actions">
                      <button onClick={handleCancelEdit} className="delete-button">Cancel</button>
                      <button onClick={() => handleUpdateNote(index)}>Save</button>
                    </div>
                  </>
                ) : (
                  <>
                    <blockquote className="verse-text">"{verse.text}"</blockquote>
                    <cite className="verse-reference">- {verse.reference}</cite>
                    {verse.note && <p className="saved-note">{verse.note}</p>}
                    <div className="verse-actions">
                      <button onClick={() => handleEditClick(verse, index)} className="delete-button">Edit</button>
                      <button onClick={() => handleDeleteVerse(verse)} className="delete-button">Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no saved verses yet. Save one from the homepage!</p>
        )}
      </div>

      <div className="prayer-requests-section">
        <h3 className="subtitle-font">My Prayer Requests</h3>
        {userData?.prayerRequests && userData.prayerRequests.length > 0 ? (
          <ul className="prayer-requests-list">
            {userData.prayerRequests.sort((a, b) => b.requestedAt.seconds - a.requestedAt.seconds).map((req, index) => (
              <li key={index} className="prayer-request-item">
                <p className="prayer-request-text">{req.request}</p>
                <div className="prayer-request-actions">
                  <button onClick={() => handleDeletePrayerRequest(req)} className="delete-button">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>You have not submitted any prayer requests yet.</p>
        )}
      </div>
    </>
  );
}

export default Profile;