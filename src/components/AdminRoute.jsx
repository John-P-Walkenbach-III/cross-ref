import React from 'react';
import { Navigate } from 'react-router-dom';

function AdminRoute({ userProfile, children }) {
  // While the user profile is loading, userProfile might be null.
  // We can't determine the role yet, so we don't render the children.
  // Returning null or a loading spinner is a good option.
  if (!userProfile) {
    return <p>Loading user details...</p>; // Or return null;
  }

  // Check if the user has the 'admin' role.
  if (userProfile.role !== 'admin') {
    // If not an admin, redirect them to the home page.
    return <Navigate to="/" replace />;
  }

  // If they are an admin, render the protected component.
  return children;
}

export default AdminRoute;