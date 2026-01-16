import React, { useState, useRef, useEffect } from 'react';

const verseData = [
  {
    start: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting ",
    answer: "life",
    end: ".",
    reference: "John 3:16"
  },
  {
    start: "The Lord is my shepherd; I shall not ",
    answer: "want",
    end: ".",
    reference: "Psalm 23:1"
  },
  {
    start: "I can do all things through Christ who ",
    answer: "strengthens",
    end: " me.",
    reference: "Philippians 4:13"
  },
  {
    start: "In the beginning was the Word, and the Word was with God, and the Word was ",
    answer: "God",
    end: ".",
    reference: "John 1:1"
  }
];

function FillInTheBlank() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentQuestion]);

  const checkAnswer = (e) => {
    e.preventDefault();
    const isCorrect = userInput.trim().toLowerCase() === verseData[currentQuestion].answer.toLowerCase();

    if (isCorrect) {
      setScore(score + 1);
      setFeedback('Correct!');
    } else {
      setFeedback(`The correct answer was: ${verseData[currentQuestion].answer}`);
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < verseData.length) {
        setCurrentQuestion(nextQuestion);
        setUserInput('');
        setFeedback('');
      } else {
        setShowScore(true);
      }
    }, 2500);
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setFeedback('');
    setUserInput('');
  };

  const currentVerse = verseData[currentQuestion];

  return (
    <div className="text-page-container">
      <h2 className="title-font">Fill in the Blank</h2>
      <div className="trivia-container">
        {showScore ? (
          <div className="score-section">
            You scored {score} out of {verseData.length}!
            <button onClick={restartGame}>Play Again</button>
          </div>
        ) : (
          <>
            <div className="question-section">
              <div className="question-count">
                <span>Verse {currentQuestion + 1}</span>/{verseData.length}
              </div>
              <div className="question-text">
                {currentVerse.start}
                <span className="blank-space">__________</span>
                {currentVerse.end}
                <p className="verse-reference" style={{textAlign: 'right', marginTop: '1rem'}}>{currentVerse.reference}</p>
              </div>
            </div>
            <form onSubmit={checkAnswer} className="answer-section" style={{display: 'block'}}>
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="bible-search-input"
                placeholder="Type the missing word"
                disabled={!!feedback}
              />
              {feedback && <p className="trivia-feedback" style={{marginTop: '1rem'}}>{feedback}</p>}
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default FillInTheBlank;