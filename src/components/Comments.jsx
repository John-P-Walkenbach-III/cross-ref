import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';

function Comments({ postId, user, userProfile }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const isAdmin = userProfile?.role === 'admin';

  useEffect(() => {
    if (!postId) return;

    const commentsCollectionRef = collection(db, 'posts', postId, 'comments');
    const q = query(commentsCollectionRef, orderBy('createdAt', 'asc'));

    // Use onSnapshot for real-time updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toLocaleString() || 'Just now'
      }));
      setComments(commentsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching comments: ", error);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const commentsCollectionRef = collection(db, 'posts', postId, 'comments');
    try {
      await addDoc(commentsCollectionRef, {
        text: newComment,
        createdAt: serverTimestamp(),
        authorUid: user.uid,
        authorName: user.displayName,
        authorPhotoURL: user.photoURL
      });
      setNewComment('');
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteDoc(doc(db, 'posts', postId, 'comments', commentId));
      } catch (error) {
        console.error("Error deleting comment: ", error);
      }
    }
  };

  return (
    <div className="comments-section">
      <h3 className="subtitle-font">Comments ({comments.length})</h3>
      
      {user ? (
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Leave a comment..."
            rows="3"
          />
          <button type="submit" disabled={!newComment.trim()}>Post Comment</button>
        </form>
      ) : (
        <p>Please log in to leave a comment.</p>
      )}

      <div className="comments-list">
        {loading && <p>Loading comments...</p>}
        {!loading && comments.length === 0 && <p>No comments yet. Be the first to comment!</p>}
        {comments.map(comment => (
          <div key={comment.id} className="comment-item">
            <img src={comment.authorPhotoURL || '/default-profile.png'} alt={comment.authorName} className="comment-author-photo" />
            <div className="comment-content">
              <div className="comment-header">
                <span className="comment-author-name">{comment.authorName}</span>
                <span className="comment-date">{comment.createdAt}</span>
              </div>
              <p className="comment-text">{comment.text}</p>
            </div>
            {(isAdmin || user?.uid === comment.authorUid) && (
              <button onClick={() => handleDeleteComment(comment.id)} className="delete-comment-button">
                &times;
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comments;