import { useState } from 'react';
import { Link } from 'react-router-dom';
import TextInput from '../components/TextInput';
import TextOutput from '../components/TextOutput';
import './AIAssistant.css';

function AIAssistant() {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTextSubmit = async (text) => {
    setLoading(true);
    try {
      // Mock response until backend summarize endpoint is ready
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      setOutput(`📝 You submitted: "${text}"\n\n⏳ Waiting for backend /api/summarize endpoint to be implemented...`);
      
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

  return (
    <div className="ai-assistant-container">
      <header className="page-header">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <h1>🤖 AI Study Assistant</h1>
        <p>Get summaries and generate quizzes from your study materials</p>
      </header>

      <div className="ai-content">
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
      </div>
    </div>
  );
}

export default AIAssistant;
