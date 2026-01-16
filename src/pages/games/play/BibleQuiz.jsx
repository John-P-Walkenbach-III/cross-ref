import React, { useState } from 'react';

// For simplicity, the questions are stored here for now.
// We can move them to Firestore later!
const quizQuestions = [
  {
    question: "Who was the first king of Israel?",
    options: ["David", "Saul", "Solomon", "Samuel"],
    answer: "Saul",
  },
  {
    question: "How many books are in the New Testament?",
    options: ["27", "39", "66", "24"],
    answer: "27",
  },
  {
    question: "What was the name of the mountain where Moses received the Ten Commandments?",
    options: ["Mount of Olives", "Mount Carmel", "Mount Sinai", "Mount Zion"],
    answer: "Mount Sinai",
  },
  {
    question: "Who wrote the majority of the Psalms?",
    options: ["Solomon", "Moses", "Asaph", "David"],
    answer: "David",
  },
  {
    question: "What is the shortest book in the New Testament?",
    options: ["Philemon", "Titus", "3 John", "2 John"],
    answer: "2 John",
  },
  {
    question: "After Jesus was arrested, which apostle disowned him three times?",
    options: ["Peter", "John", "Andrew", "James"],
    answer: "Peter",
  },
  {
    question: "What is the first book of the Bible?",
    options: ["Genesis", "Exodus", "Matthew", "Revelation"],
    answer: "Genesis",
  },
  {
    question: "Who was swallowed by a great fish?",
    options: ["Daniel", "Jonah", "Elijah", "Job"],
    answer: "Jonah",
  },
  {
    question: "What were the names of Adam and Eve's first two sons?",
    options: ["Jacob and Esau", "David and Solomon", "Cain and Abel", "Peter and Paul"],
    answer: "Cain and Abel",
  },
  {
    question: "Which of these is NOT one of the Ten Plagues of Egypt?",
    options: ["Frogs", "Locusts", "Famine", "Darkness"],
    answer: "Famine",
  },
  {
    question: "Who was the Roman governor who sentenced Jesus to death?",
    options: ["Herod", "Caesar Augustus", "Pontius Pilate", "Nero"],
    answer: "Pontius Pilate",
  },
  {
    question: "What is the last book of the Bible?",
    options: ["Malachi", "Jude", "Genesis", "Revelation"],
    answer: "Revelation",
  },
];

function BibleQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleAnswerClick = (option) => {
    const isCorrect = option === quizQuestions[currentQuestion].answer;

    if (isCorrect) {
      setScore(score + 1);
      setFeedback('Correct!');
    } else {
      setFeedback(`Sorry, the correct answer was ${quizQuestions[currentQuestion].answer}.`);
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < quizQuestions.length) {
        setCurrentQuestion(nextQuestion);
        setFeedback('');
      } else {
        setShowScore(true);
      }
    }, 2000); // Wait 2 seconds before moving on
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setFeedback('');
  };

  return (
    <div className="text-page-container">
      <h2 className="title-font">Bible Quiz</h2>
      <div className="trivia-container"> {/* Reusing existing styles */}
        {showScore ? (
          <div className="score-section">
            You scored {score} out of {quizQuestions.length}!
            <button onClick={restartGame}>Play Again</button>
          </div>
        ) : (
          <>
            <div className="question-section">
              <div className="question-count">
                <span>Question {currentQuestion + 1}</span>/{quizQuestions.length}
              </div>
              <div className="question-text">{quizQuestions[currentQuestion].question}</div>
            </div>
            <div className="answer-section">
              {quizQuestions[currentQuestion].options.map((option) => (
                <button key={option} onClick={() => handleAnswerClick(option)} disabled={!!feedback}>
                  {option}
                </button>
              ))}
            </div>
            {feedback && <p className="trivia-feedback">{feedback}</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default BibleQuiz;