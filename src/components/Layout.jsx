import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function Layout({ children, user, userProfile }) {
  return (
    <div className="layout-container">
      <div className="content-wrap">
        <Header user={user} userProfile={userProfile} />
        <div className="page-content"><Outlet context={{ user, userProfile }} /></div>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;