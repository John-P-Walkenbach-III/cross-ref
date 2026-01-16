import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';

function EditPost() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { postId } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDocRef = doc(db, 'posts', postId);
        const docSnap = await getDoc(postDocRef);
        if (docSnap.exists()) {
          const postData = docSnap.data();
          setTitle(postData.title);
          setAuthor(postData.author);
          setSummary(postData.summary);
          setContent(postData.content);
        } else {
          setError("Post not found.");
        }
      } catch (err) {
        setError("Failed to load post data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !summary || !content) {
      setError('Please fill out all fields.');
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const postDocRef = doc(db, 'posts', postId);
      await updateDoc(postDocRef, {
        title,
        author,
        summary,
        content,
        updatedAt: serverTimestamp(),
      });
      navigate(`/blog/${postId}`); // Redirect to the post page after successful update
    } catch (err) {
      console.error("Error updating document: ", err);
      setError("Failed to update post. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>Loading post for editing...</p>;

  return (
    <div className="text-page-container">
      <h1 className="title-font">Edit Blog Post</h1>
      <form onSubmit={handleSubmit} className="add-post-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="author">Author</label>
          <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="summary">Summary</label>
          <textarea id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} rows="3" required />
        </div>
        <div className="form-group">
          <label htmlFor="content">Full Content</label>
          <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows="10" required />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

export default EditPost;