import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import Comments from '../components/Comments';
import Spinner from '../components/Spinner';

function BlogPost() {
  const { user, userProfile } = useOutletContext(); // Get user data from the layout context
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isAdmin = userProfile?.role === 'admin';
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const postDocRef = doc(db, 'posts', postId);
        const docSnap = await getDoc(postDocRef);

        if (docSnap.exists()) {
          const postData = {
            id: docSnap.id,
            ...docSnap.data(),
            createdAt: docSnap.data().createdAt.toDate().toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            })
          };
          setPost(postData);
        } else {
          setError("Sorry, we couldn't find that post.");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load the post. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'posts', postId));
        navigate('/blog');
      } catch (err) {
        console.error("Error deleting post:", err);
        setError("Failed to delete the post. Please try again.");
      }
    }
  };

  if (loading) return <Spinner message="Loading post..." />;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="text-page-container blog-post-full">
      <Link to="/blog" className="back-to-blog-link">&larr; Back to all posts</Link>
      {post && (
        <>
          {isAdmin && (
            <div className="admin-actions">
              <Link to={`/admin/edit-post/${post.id}`} className="button-as-link">Edit Post</Link>
              <button onClick={handleDelete} className="delete-button">Delete Post</button>
            </div>
          )}
          <h1 className="title-font">{post.title}</h1>
          <p className="post-meta">Posted on {post.createdAt} by {post.author}</p>
          <div className="blog-post-content">
            {post.content}
          </div>
          <Comments postId={postId} user={user} userProfile={userProfile} />
        </>
      )}
    </div>
  );
}

export default BlogPost;