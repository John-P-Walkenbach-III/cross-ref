import React, { useState } from 'react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase/firebase';

function CrossReferenceModal({ verse, reference, user, onClose }) {
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [note, setNote] = useState('');

  const handleSaveVerse = async () => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userDocRef, {
        savedVerses: arrayUnion({
          text: verse.text,
          reference: reference,
          note: note,
          savedAt: new Date(),
        }),
      });
      setIsSaving(true); // Disable button after saving
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 2000);
    } catch (error) {
      console.error("Error saving verse: ", error);
    }
  };
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {showSaveSuccess && <div className="toast-notification">Verse Saved!</div>}
        <div className="modal-header">
          <h3 className="subtitle-font">Save this Verse?</h3>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="modal-body">
          <blockquote className="verse-text">"{verse.text}"</blockquote>
          <cite className="verse-reference">- {reference}</cite>
          <textarea
            className="note-textarea"
            placeholder="Add a personal note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className="modal-footer">
          <button onClick={handleSaveVerse} disabled={isSaving}>
            {isSaving ? 'Saved' : 'Save Verse'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CrossReferenceModal;