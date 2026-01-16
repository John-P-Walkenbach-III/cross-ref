import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase/firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import './ChatRoom.css';

// URL for a free notification sound
const notificationSoundUrl = 'https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3';

export default function ChatRoom({ user }) {
  const dummy = useRef();
  const [messages, setMessages] = useState([]);
  const [formValue, setFormValue] = useState('');
  const isInitialLoad = useRef(true);
  const audioPlayer = useRef(null);

  useEffect(() => {
    // Initialize the audio player once
    if (!audioPlayer.current) {
      audioPlayer.current = new Audio(notificationSoundUrl);
      audioPlayer.current.volume = 0.5;
    }

    const messagesRef = collection(db, 'messages');
    // Order by creation time and limit to last 50 messages
    const q = query(messagesRef, orderBy('createdAt'), limit(50));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        // Play sound for new messages that are not from the current user
        if (change.type === "added" && !isInitialLoad.current) {
          const newMessage = change.doc.data();
          if (newMessage.uid !== user?.uid) {
            audioPlayer.current.play().catch(error => console.error("Audio play failed", error));
          }
        }
      });

      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMessages(data);
      // Scroll to bottom when new messages arrive
      setTimeout(() => {
        dummy.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      isInitialLoad.current = false;
    });

    return unsubscribe;
  }, [user]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!formValue.trim()) return;

    const { uid, photoURL, displayName } = user;
    // Use Dicebear as a fallback if the user has no photoURL
    const avatar = photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`;

    try {
      await addDoc(collection(db, 'messages'), {
        text: formValue,
        createdAt: serverTimestamp(),
        uid,
        photoURL: avatar,
        displayName: displayName || 'Anonymous'
      });

      setFormValue('');
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  return (
    <div className="chat-room-container">
      <div className="chat-messages">
        {messages && messages.map((msg, index) => (
          <ChatMessage
            key={msg.id || index}
            message={msg}
            currentUser={user} />
        ))}
        <div ref={dummy}></div>
      </div>

      <form onSubmit={sendMessage} className="chat-form">
        <input
          className="chat-input"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="chat-submit-btn" type="submit" disabled={!formValue}>➤</button>
      </form>
    </div>
  );
}

function ChatMessage({ message, currentUser }) {
  const { text, uid, photoURL, displayName, id, createdAt, amens } = message;
  const messageClass = uid === currentUser?.uid ? 'sent' : 'received';
  const amenList = amens || [];
  const hasAmened = currentUser && amenList.includes(currentUser.uid);

  const timeString = createdAt?.toDate ? createdAt.toDate().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '';

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      await deleteDoc(doc(db, 'messages', id));
    }
  };

  const handleAmen = async () => {
    if (!currentUser) return;
    const messageRef = doc(db, 'messages', id);
    try {
      if (hasAmened) {
        await updateDoc(messageRef, { amens: arrayRemove(currentUser.uid) });
      } else {
        await updateDoc(messageRef, { amens: arrayUnion(currentUser.uid) });
      }
    } catch (error) {
      console.error("Error updating amen:", error);
    }
  };

  return (
    <div className={`message ${messageClass}`}>
      <img className="message-avatar" src={photoURL} alt={displayName || 'User'} title={displayName} />
      <div className="message-content">
        <p>
          {text}
          {timeString && <span className="timestamp">{timeString}</span>}
        </p>
        <button 
          className={`amen-btn ${hasAmened ? 'active' : ''}`} 
          onClick={handleAmen}
          title={hasAmened ? "Remove Amen" : "Amen!"}
        >
          🙏 {amenList.length > 0 && <span className="amen-count">{amenList.length}</span>}
        </button>
        {uid === currentUser?.uid && (
          <button className="delete-message-btn" onClick={handleDelete} title="Delete message">&times;</button>
        )}
      </div>
    </div>
  )
}