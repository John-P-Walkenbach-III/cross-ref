import React from 'react';
import { Link } from 'react-router-dom';

function Games() {
  return (
    <div className="text-page-container">
      <h2 className="title-font">Games</h2>
      <p className="page-description">Test your knowledge and have some fun with our collection of biblical games.</p>
      
      <div className="game-list">
        <div className="game-card">
          <h3>Bible Quiz</h3>
          <p>Test your knowledge with multiple-choice questions about key biblical events and figures.</p>
          <Link to="/games/play/bible-quiz">
            <button>Play Now</button>
          </Link>
        </div>
        <div className="game-card">
          <h3>Fill in the Blank</h3>
          <p>Complete the Bible verse by typing the missing word. A great way to practice memorization!</p>
          <Link to="/games/play/fill-in-the-blank">
            <button>Play Now</button>
          </Link>
        </div>
        <div className="game-card">
          <h3>Bible Wordle</h3>
          <p>Guess the 5-letter Bible word. Gold tiles mean you're spot on!</p>
          <Link to="/games/play/bible-wordle">
            <button>Play Now</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Games;