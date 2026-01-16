import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';

function AddPost() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('The Cross-Reference Team'); // Default author
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !summary || !content) {
      setError('Please fill out all fields.');
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      await addDoc(collection(db, 'posts'), {
        title,
        author,
        summary,
        content,
        createdAt: serverTimestamp(),
      });
      navigate('/blog'); // Redirect to blog list after successful submission
    } catch (err) {
      console.error("Error adding document: ", err);
      setError("Failed to create post. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-page-container">
      <h1 className="title-font">Add New Blog Post</h1>
      <form onSubmit={handleSubmit} className="add-post-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="summary">Summary (Short description for the blog list)</label>
          <textarea id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} rows="3" required />
        </div>
        <div className="form-group">
          <label htmlFor="content">Full Content (Supports line breaks)</label>
          <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows="10" required />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}

export default AddPost;