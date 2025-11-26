import { useState } from 'react';
import { Link } from 'react-router-dom';
import TextInput from '../components/TextInput';
import TextOutput from '../components/TextOutput';
import Quiz from '../components/Quiz';
import './AIAssistant.css';

function AIAssistant() {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState(null);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' or 'quiz'

  const handleTextSubmit = async (text) => {
    setLoading(true);
    try {
      // Mock response until backend summarize endpoint is ready
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      setOutput(`📝 Summary of your text:\n\n"${text}"\n\n⏳ Waiting for backend /api/summarize endpoint to be implemented...`);
      
      // TODO: Replace with actual API call when backend is ready:
      // const response = await fetch('http://localhost:8000/api/summarize', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ text: text }),
      // });
      // const data = await response.json();
      // setOutput(data.summary || data.message);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setLoading(true);
    try {
      // Mock quiz generation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample quiz questions
      const mockQuiz = [
        {
          question: "What is the capital of France?",
          options: ["London", "Berlin", "Paris", "Madrid"],
          correctAnswer: 2,
          explanation: "Paris is the capital and most populous city of France."
        },
        {
          question: "Which programming language is known for web development?",
          options: ["Python", "JavaScript", "C++", "Java"],
          correctAnswer: 1,
          explanation: "JavaScript is primarily used for web development and runs in browsers."
        },
        {
          question: "What does AI stand for?",
          options: ["Artificial Intelligence", "Automated Interface", "Advanced Integration", "Applied Information"],
          correctAnswer: 0,
          explanation: "AI stands for Artificial Intelligence, the simulation of human intelligence by machines."
        }
      ];
      
      setQuizQuestions(mockQuiz);
      setActiveTab('quiz');
      
      // TODO: Replace with actual API call when backend is ready:
      // const response = await fetch('http://localhost:8000/api/generate-quiz', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ text: yourText }),
      // });
      // const data = await response.json();
      // setQuizQuestions(data.questions);
    } catch (error) {
      setOutput(`Error generating quiz: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = (score, total) => {
    console.log(`Quiz completed! Score: ${score}/${total}`);
    // You can add additional logic here, like saving the score to the backend
  };

  return (
    <div className="ai-assistant-container">
      <header className="page-header">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <h1>🤖 AI Study Assistant</h1>
        <p>Get summaries and generate quizzes from your study materials</p>
      </header>

      <div className="ai-content">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            📝 Summary
          </button>
          <button
            className={`tab ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => setActiveTab('quiz')}
          >
            ✍️ Quiz
          </button>
        </div>

        {activeTab === 'summary' ? (
          <>
            <TextInput
              label="Enter your text or question:"
              placeholder="Type your question or paste text here to get a summary..."
              onSubmit={handleTextSubmit}
            />

            {loading && <div className="loading-spinner">⏳ Processing...</div>}

            <TextOutput
              label="AI Response:"
              content={output}
              placeholder="Your AI-generated response will appear here..."
            />
          </>
        ) : (
          <>
            <div className="quiz-section">
              {!quizQuestions ? (
                <div className="quiz-prompt">
                  <p>Generate a quiz to test your knowledge!</p>
                  <button onClick={handleGenerateQuiz} className="btn-generate-quiz" disabled={loading}>
                    {loading ? 'Generating...' : '🎯 Generate Quiz'}
                  </button>
                </div>
              ) : (
                <Quiz questions={quizQuestions} onComplete={handleQuizComplete} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AIAssistant;
