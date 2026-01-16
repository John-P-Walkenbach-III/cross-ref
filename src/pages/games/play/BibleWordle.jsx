import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const WORD_DATA = [
  { word: 'JESUS', verse: "And she shall bring forth a son, and thou shalt call his name JESUS: for he shall save his people from their sins. - Matthew 1:21" },
  { word: 'FAITH', verse: "Now faith is the substance of things hoped for, the evidence of things not seen. - Hebrews 11:1" },
  { word: 'GLORY', verse: "The heavens declare the glory of God; and the firmament sheweth his handywork. - Psalm 19:1" },
  { word: 'DAVID', verse: "He chose David also his servant, and took him from the sheepfolds. - Psalm 78:70" },
  { word: 'CROSS', verse: "But God forbid that I should glory, save in the cross of our Lord Jesus Christ. - Galatians 6:14" },
  { word: 'PEACE', verse: "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. - John 14:27" },
  { word: 'GRACE', verse: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God. - Ephesians 2:8" },
  { word: 'MERCY', verse: "Let us therefore come boldly unto the throne of grace, that we may obtain mercy, and find grace to help in time of need. - Hebrews 4:16" },
  { word: 'TRUTH', verse: "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me. - John 14:6" },
  { word: 'LIGHT', verse: "Thy word is a lamp unto my feet, and a light unto my path. - Psalm 119:105" },
  { word: 'BREAD', verse: "And Jesus said unto them, I am the bread of life: he that cometh to me shall never hunger. - John 6:35" },
  { word: 'WATER', verse: "But whosoever drinketh of the water that I shall give him shall never thirst. - John 4:14" },
  { word: 'ANGEL', verse: "For he shall give his angels charge over thee, to keep thee in all thy ways. - Psalm 91:11" },
  { word: 'MOSES', verse: "And God said unto Moses, I AM THAT I AM. - Exodus 3:14" },
  { word: 'PETER', verse: "And I say also unto thee, That thou art Peter, and upon this rock I will build my church. - Matthew 16:18" },
  { word: 'WORLD', verse: "For God so loved the world, that he gave his only begotten Son. - John 3:16" },
  { word: 'HEART', verse: "Create in me a clean heart, O God; and renew a right spirit within me. - Psalm 51:10" },
  { word: 'BLOOD', verse: "But if we walk in the light, as he is in the light... the blood of Jesus Christ his Son cleanseth us from all sin. - 1 John 1:7" },
  { word: 'FLESH', verse: "And the Word was made flesh, and dwelt among us. - John 1:14" },
  { word: 'SHEEP', verse: "My sheep hear my voice, and I know them, and they follow me. - John 10:27" },
  { word: 'FRUIT', verse: "But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith. - Galatians 5:22" },
  { word: 'BIBLE', verse: "All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction. - 2 Timothy 3:16" },
  { word: 'STONE', verse: "The stone which the builders refused is become the head stone of the corner. - Psalm 118:22" },
  { word: 'POWER', verse: "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind. - 2 Timothy 1:7" },
  { word: 'SAINT', verse: "Precious in the sight of the Lord is the death of his saints. - Psalm 116:15" },
  { word: 'SWORD', verse: "For the word of God is quick, and powerful, and sharper than any twoedged sword. - Hebrews 4:12" },
  { word: 'WOMAN', verse: "And the rib, which the Lord God had taken from man, made he a woman, and brought her unto the man. - Genesis 2:22" },
  { word: 'YOUTH', verse: "Let no man despise thy youth; but be thou an example of the believers. - 1 Timothy 4:12" },
  { word: 'EARTH', verse: "In the beginning God created the heaven and the earth. - Genesis 1:1" },
  { word: 'NIGHT', verse: "And God called the light Day, and the darkness he called Night. - Genesis 1:5" },
  { word: 'ALIVE', verse: "I am he that liveth, and was dead; and, behold, I am alive for evermore, Amen. - Revelation 1:18" }
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
  const [isShaking, setIsShaking] = useState(false);
  const [showToast, setShowToast] = useState(false);

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
  }, [currentGuess, gameOver, guesses, solutionData, isShaking]);

  const handleInput = (key) => {
    if (gameOver || !solutionData) return;

    if (key === 'ENTER') {
      if (currentGuess.length !== 5) {
        setIsShaking(false);
        setTimeout(() => setIsShaking(true), 10);
        return;
      }
      
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

  const getShareText = () => {
    const grid = guesses.map(guess => {
      const guessChars = guess.split('');
      const solutionChars = solutionData.word.split('');
      const rowEmojis = Array(5).fill('⬛');

      // Pass 1: Correct (Gold)
      guessChars.forEach((char, i) => {
        if (char === solutionChars[i]) {
          rowEmojis[i] = '🟨';
          solutionChars[i] = null;
        }
      });

      // Pass 2: Present (White)
      guessChars.forEach((char, i) => {
        if (rowEmojis[i] === '⬛') {
          const indexInSolution = solutionChars.indexOf(char);
          if (indexInSolution > -1) {
            rowEmojis[i] = '⬜';
            solutionChars[indexInSolution] = null;
          }
        }
      });

      return rowEmojis.join('');
    }).join('\n');

    const score = gameStatus === 'won' ? guesses.length : 'X';
    const shareUrl = 'https://crossreferenc.web.app/games/play/bible-wordle';
    return `Bible Wordle ${score}/6\n\n${grid}\n\n${shareUrl}`;
  };

  const handleShare = async () => {
    if (!solutionData) return;
    const shareText = getShareText();

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bible Wordle Results',
          text: shareText,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = async () => {
    if (!solutionData) return;
    const shareText = getShareText();
    try {
      await navigator.clipboard.writeText(shareText);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!solutionData) return null;

  return (
    <div className="text-page-container wordle-container">
      {showToast && <div className="toast-notification">Results copied to clipboard!</div>}
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
          <Row 
            currentGuess={currentGuess} 
            solution={solutionData.word} 
            isShaking={isShaking} 
            onShakeEnd={() => setIsShaking(false)}
          />
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
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={handlePlayAgain}>Play Again</button>
            <button onClick={handleShare}>Share</button>
            <button onClick={handleCopy}>Copy</button>
          </div>
          <br />
          <Link to="/games" style={{ display: 'inline-block', marginTop: '1rem' }}>Back to Games</Link>
        </div>
      )}
    </div>
  );
}

function Row({ guess, currentGuess, solution, isShaking, onShakeEnd }) {
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
      <div className={`wordle-row ${isShaking ? 'shake' : ''}`} onAnimationEnd={onShakeEnd}>
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