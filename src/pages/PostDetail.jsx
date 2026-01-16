import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import Spinner from '../components/Spinner';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default "Heavenly" themed image if the post doesn't have one
  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2022&auto=format&fit=crop";

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const postData = { id: docSnap.id, ...docSnap.data() };
          setPost(postData);
          updateSeoTags(postData);
        } else {
          setError("Post not found.");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();

    // Cleanup: Reset title when leaving the page
    return () => {
      document.title = "Cross Ref";
    };
  }, [id]);

  const updateSeoTags = (postData) => {
    // 1. Set Document Title
    document.title = `${postData.title} | Cross Ref`;

    // 2. Helper function to update or create meta tags
    const setMetaTag = (attrName, attrValue, content) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content || '');
    };

    // 3. Prepare content
    // Use summary if available, otherwise grab first 150 chars of content
    const description = postData.summary || (postData.content ? postData.content.substring(0, 150) + "..." : "Read this post on Cross Ref");
    const image = postData.imageUrl || DEFAULT_IMAGE;
    const url = window.location.href;

    // 4. Set Open Graph & Twitter Tags
    setMetaTag('property', 'og:title', postData.title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:url', url);
    setMetaTag('name', 'twitter:card', 'summary_large_image');
  };

  if (loading) return <Spinner message="Loading post..." />;
  
  if (error) {
    return (
      <div className="text-page-container">
        <p className="error-message">{error}</p>
        <Link to="/blog" className="back-to-blog-link">&larr; Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="text-page-container blog-post-full">
      <Link to="/blog" className="back-to-blog-link">&larr; Back to Blog</Link>
      <h1 className="title-font">{post.title}</h1>
      <p className="post-meta">
        Posted on {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString()}
        {post.author && ` by ${post.author}`}
      </p>
      <div className="blog-post-content">{post.content}</div>
    </div>
  );
}

export default PostDetail;