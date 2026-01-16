import React from 'react';

function AboutUs() {
  return (
    <div className="text-page-container">
      <h2 className="subtitle-font">About Us</h2>

      <div className="text-section">
        <h4>Our Mission</h4>
        <p>
          Cross-Reference was born from a simple desire: to create a quiet, focused space for believers to engage with the Word of God. In a world full of digital distractions, our mission is to provide tools that deepen your understanding of scripture, foster a consistent prayer life, and connect you with the timeless truths of the Christian faith.
        </p>
      </div>

      <div className="text-section">
        <h4>What We Offer</h4>
        <p>
          This application is a personal project dedicated to serving the community. Here, you can read the Bible, save meaningful verses for reflection, add personal notes, and test your knowledge with our Bible quiz. The prayer and media sections are designed to encourage and uplift you in your daily walk with Christ.
        </p>
      </div>

      <div className="text-section">
        <h4>Our Hope</h4>
        <p>
          Our hope is that Cross-Reference becomes a valuable companion in your spiritual journey. Whether you have two minutes or two hours, we pray this platform helps you to draw nearer to God and find strength and inspiration in His Word. Thank you for being a part of this community.
        </p>
      </div>

      <div className="text-section">
        <h4>Site Development and Creator</h4>
        <p>
          This application was built using modern web technologies including the React framework for the user interface, Firebase for authentication and the Firestore database, and React Router for seamless navigation. The site is styled with custom CSS to create a unique and focused user experience.
        </p>
        <div className="developer-info">
          <img src="/jpw3.png" alt="John P. Walkenbach III" className="developer-photo" />
          <div>
            <p style={{ margin: 0, fontWeight: 'bold' }}>John P. Walkenbach III</p>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#aaa' }}>Developer</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;