import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const WORD_DATA = [
  { word: 'JESUS', verse: "And she shall bring forth a son, and thou shalt call his name JESUS: for he shall save his people from their sins. - Matthew 1:21" },
  { word: 'FAITH', verse: "Now faith is the substance of things hoped for, the evidence of things not seen. - Hebrews 11:1" },
  { word: 'GLORY', verse: "The heavens declare the glory of God; and the firmament sheweth his handywork. - Psalm 19:1" },
  { word: 'DAVID', verse: "He chose David also his servant, and took him from the sheepfolds. - Psalm 78:70" },
  { word: 'CROSS', verse: "But God forbid that I should glory, save in the cross of our Lord Jesus Christ. - Galatians 6:14" },
  { word: 'PEACE', verse: "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. - John 14:27" }
];

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
];

function BibleWordle() {
  const [solutionData, setSolutionData] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [gameStatus, setGameStatus] = useState(''); // 'won' or 'lost'

  useEffect(() => {
    // Pick a random word on mount
    const random = WORD_DATA[Math.floor(Math.random() * WORD_DATA.length)];
    setSolutionData(random);
  }, []);

  useEffect(() => {
    const handleWindowKeyup = (e) => {
      handleInput(e.key.toUpperCase());
    };

    window.addEventListener('keyup', handleWindowKeyup);
    return () => window.removeEventListener('keyup', handleWindowKeyup);
  }, [currentGuess, gameOver, guesses, solutionData]);

  const handleInput = (key) => {
    if (gameOver || !solutionData) return;

    if (key === 'ENTER') {
      if (currentGuess.length !== 5) return;
      
      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      setCurrentGuess('');

      if (currentGuess === solutionData.word) {
        setGameOver(true);
        setGameStatus('won');
      } else if (newGuesses.length >= 6) {
        setGameOver(true);
        setGameStatus('lost');
      }
    } else if (key === 'BACKSPACE' || key === 'DEL') {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key)) {
      if (currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + key);
      }
    }
  };

  const handleGiveUp = () => {
    setGameOver(true);
    setGameStatus('lost');
  };

  const handlePlayAgain = () => {
    const random = WORD_DATA[Math.floor(Math.random() * WORD_DATA.length)];
    setSolutionData(random);
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setGameStatus('');
  };

  if (!solutionData) return null;

  return (
    <div className="text-page-container wordle-container">
      <h2 className="title-font">Bible Wordle</h2>
      <p className="page-description">Guess the 5-letter Bible word in 6 tries.</p>
      
      <div className="wordle-legend">
        <span className="legend-item"><span className="legend-dot correct"></span> Correct Spot</span>
        <span className="legend-item"><span className="legend-dot present"></span> Wrong Spot</span>
        <span className="legend-item"><span className="legend-dot absent"></span> Not in Word</span>
      </div>

      <div className="wordle-grid">
        {/* Render past guesses */}
        {guesses.map((guess, i) => (
          <Row key={i} guess={guess} solution={solutionData.word} />
        ))}
        
        {/* Render current guess */}
        {!gameOver && guesses.length < 6 && (
          <Row currentGuess={currentGuess} solution={solutionData.word} />
        )}

        {/* Render empty rows */}
        {Array.from({ length: 6 - guesses.length - (gameOver ? 0 : 1) }).map((_, i) => (
          <Row key={`empty-${i}`} />
        ))}
      </div>

      <Keyboard guesses={guesses} solution={solutionData.word} onInput={handleInput} />

      {!gameOver && (
        <button
          onClick={handleGiveUp}
          style={{
            marginTop: '2rem',
            backgroundColor: 'transparent',
            color: '#aaa',
            borderColor: '#555',
            fontSize: '0.8rem',
            padding: '8px 16px'
          }}
        >
          Give Up
        </button>
      )}

      {gameOver && (
        <div className="wordle-modal">
          {gameStatus === 'won' ? (
            <>
              <h3 style={{ color: 'var(--accent-gold)' }}>Victory!</h3>
              <p className="wordle-verse">"{solutionData.verse}"</p>
            </>
          ) : (
            <>
              <h3>Game Over</h3>
              <p>The word was <strong>{solutionData.word}</strong></p>
            </>
          )}
          <button onClick={handlePlayAgain}>Play Again</button>
          <br />
          <Link to="/games" style={{ display: 'inline-block', marginTop: '1rem' }}>Back to Games</Link>
        </div>
      )}
    </div>
  );
}

function Row({ guess, currentGuess, solution }) {
  if (guess) {
    const guessChars = guess.split('');
    const solutionChars = solution.split('');
    const statuses = Array(5).fill('absent');

    // Pass 1: Find correct matches (Green)
    guessChars.forEach((char, i) => {
      if (char === solutionChars[i]) {
        statuses[i] = 'correct';
        solutionChars[i] = null; // Mark as used
      }
    });

    // Pass 2: Find present matches (White/Yellow)
    guessChars.forEach((char, i) => {
      if (statuses[i] !== 'correct') {
        const indexInSolution = solutionChars.indexOf(char);
        if (indexInSolution > -1) {
          statuses[i] = 'present';
          solutionChars[indexInSolution] = null; // Mark as used
        }
      }
    });

    return (
      <div className="wordle-row">
        {guessChars.map((char, i) => {
          // Add a small delay for animation effect if desired, but keeping it simple for now
          return <div key={i} className={`wordle-tile ${statuses[i]}`}>{char}</div>;
        })}
      </div>
    );
  }

  if (currentGuess !== undefined) {
    const chars = currentGuess.split('');
    return (
      <div className="wordle-row">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="wordle-tile active">{chars[i]}</div>
        ))}
      </div>
    );
  }

  return (
    <div className="wordle-row">
      {Array.from({ length: 5 }).map((_, i) => <div key={i} className="wordle-tile"></div>)}
    </div>
  );
}

function Keyboard({ guesses, solution, onInput }) {
  const getKeyStatus = (key) => {
    let status = '';
    
    // Check all guesses to determine key status
    // Priority: correct > present > absent
    for (const guess of guesses) {
      const guessChars = guess.split('');
      const solutionChars = solution.split('');
      
      for (let i = 0; i < 5; i++) {
        if (guessChars[i] === key) {
          if (solutionChars[i] === key) {
            return 'correct'; // Found exact match, highest priority
          }
          if (solution.includes(key)) {
            status = 'present';
          } else if (status === '') {
            status = 'absent';
          }
        }
      }
    }
    return status;
  };

  return (
    <div className="wordle-keyboard">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => {
            const status = getKeyStatus(key);
            let displayKey = key;
            if (key === 'BACKSPACE') displayKey = '⌫';
            
            return (
              <button
                key={key}
                className={`keyboard-key ${status} ${key.length > 1 ? 'wide' : ''}`}
                onClick={() => onInput(key)}
              >
                {displayKey}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default BibleWordle;