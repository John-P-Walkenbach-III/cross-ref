import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import Spinner from '../components/Spinner';


function Blog({ userProfile }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAdmin = userProfile?.role === 'admin';

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteDoc(doc(db, 'posts', postId));
        // Remove the post from the local state to update the UI instantly
        setPosts(posts.filter(post => post.id !== postId));
      } catch (err) {
        console.error("Error deleting post: ", err);
        // You could set an error state here to show a message to the user
      }
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const postsCollectionRef = collection(db, 'posts');
        const q = query(postsCollectionRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Convert Firestore Timestamp to a readable date string
          createdAt: doc.data().createdAt.toDate().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          })
        }));
        setPosts(postsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching blog posts: ", err);
        setError("Failed to load blog posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Show a full-page spinner while loading
  if (loading) return <Spinner message="Loading posts..." />;

  return (
    <div className="text-page-container blog-container">
      <div className="title-container">
        <h1 className="title-font">Our Blog</h1>
      </div>
      <p className="page-description">
        Thoughts, reflections, and news from our community.
      </p>

      {isAdmin && (
        <div className="blog-actions">
          <Link to="/admin/add-post" className="button-as-link">Add New Post</Link>
        </div>
      )}

      <div className="blog-posts-list ">
        {error && <p className="error-message">{error}</p>}
        {!loading && posts.length === 0 && !error && <p>No blog posts have been added yet. Please check back soon!</p>}
        {posts.map(post => (
          <article key={post.id} className="blog-post-summary">
            <h2>{post.title}</h2>
            <p className="post-meta">Posted on {post.createdAt} by {post.author}</p>
            <p>{post.summary}</p>
            <div className="post-actions">
              <Link to={`/blog/${post.id}`} className="read-more-button">Read More &rarr;</Link>
              {isAdmin && (
                <>
                  <Link to={`/admin/edit-post/${post.id}`} className="edit-link">Edit</Link>
                  <button onClick={() => handleDelete(post.id)} className="delete-link">Delete</button>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Blog;