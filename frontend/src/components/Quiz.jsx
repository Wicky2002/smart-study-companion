import { useState } from 'react';
import './Quiz.css';

function Quiz({ questions, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
    if (onComplete) {
      onComplete(correctCount, questions.length);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="quiz-container">
        <p className="no-quiz">No quiz questions available. Generate a quiz to get started!</p>
      </div>
    );
  }

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="quiz-container">
        <div className="quiz-results">
          <h2>Quiz Complete! 🎉</h2>
          <div className="score-display">
            <div className="score-circle">
              <span className="score-text">{percentage}%</span>
            </div>
            <p className="score-detail">
              You got {score} out of {questions.length} questions correct!
            </p>
          </div>
          
          <div className="results-breakdown">
            <h3>Review Your Answers:</h3>
            {questions.map((question, qIndex) => {
              const userAnswer = selectedAnswers[qIndex];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div key={qIndex} className={`result-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="result-header">
                    <span className="result-icon">{isCorrect ? '✓' : '✗'}</span>
                    <span className="question-number">Question {qIndex + 1}</span>
                  </div>
                  <p className="question-text">{question.question}</p>
                  <div className="answer-review">
                    <p className="user-answer">
                      Your answer: <strong>{question.options[userAnswer]}</strong>
                    </p>
                    {!isCorrect && (
                      <p className="correct-answer">
                        Correct answer: <strong>{question.options[question.correctAnswer]}</strong>
                      </p>
                    )}
                  </div>
                  {question.explanation && (
                    <p className="explanation">
                      <strong>Explanation:</strong> {question.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="results-actions">
            <button onClick={handleRetry} className="btn-retry">Retry Quiz</button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="progress-text">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      <div className="quiz-content">
        <h3 className="question-title">{question.question}</h3>
        
        <div className="options-list">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${selectedAnswers[currentQuestion] === index ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(currentQuestion, index)}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">{option}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="quiz-navigation">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="btn-nav"
        >
          ← Previous
        </button>
        
        {currentQuestion === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswers[currentQuestion] === undefined}
            className="btn-submit"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === undefined}
            className="btn-nav"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}

export default Quiz;
