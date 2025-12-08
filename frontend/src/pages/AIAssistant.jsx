import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { aiAPI } from '../services/api';
import TextInput from '../components/TextInput';
import TextOutput from '../components/TextOutput';
import './AIAssistant.css';

function AIAssistant() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary', 'plan', 'flashcards', 'advice'
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate, isAuthenticated]);

  const handleGenerateSummary = async (text) => {
    setLoading(true);
    try {
      const data = await aiAPI.generateSummary({ text });
      setOutput(data.summary || data.message || 'Summary generated successfully!');
    } catch (error) {
      console.error('Failed to generate summary:', error);
      setOutput(`Error: ${error.message || 'Failed to generate summary'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateStudyPlan = async (text) => {
    setLoading(true);
    try {
      const data = await aiAPI.generateStudyPlan({ 
        topic: text,
        duration_weeks: 4,
        difficulty: 'intermediate'
      });
      
      // Format the study plan object into readable text
      if (data.study_plan) {
        const plan = data.study_plan;
        let formattedPlan = `📚 Study Plan for ${plan.topic}\n`;
        formattedPlan += `Duration: ${plan.duration} days | Difficulty: ${plan.difficulty}\n\n`;
        
        // Show overview only if it's not too repetitive
        const overviewLines = plan.ai_generated_overview.split('\n').filter(line => line.trim());
        if (overviewLines.length > 0 && overviewLines[0].length < 200) {
          formattedPlan += `${overviewLines[0]}\n\n`;
        }
        
        formattedPlan += `📅 Daily Schedule:\n`;
        plan.daily_tasks.forEach(task => {
          formattedPlan += `\nDay ${task.day}: ${task.task}`;
        });
        formattedPlan += `\n\n📝 Study Tips:\n`;
        plan.tips.forEach(tip => {
          formattedPlan += `• ${tip}\n`;
        });
        setOutput(formattedPlan);
      } else {
        setOutput(data.message || 'Study plan generated successfully!');
      }
    } catch (error) {
      console.error('Failed to generate study plan:', error);
      setOutput(`Error: ${error.message || 'Failed to generate study plan'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFlashcards = async (text) => {
    setLoading(true);
    try {
      const data = await aiAPI.generateFlashcards({ 
        topic: text,
        count: 10
      });
      if (data.flashcards && Array.isArray(data.flashcards)) {
        const formatted = data.flashcards.map((card, idx) => 
          `${idx + 1}. Q: ${card.question}\n   A: ${card.answer}\n`
        ).join('\n');
        setOutput(formatted);
      } else {
        setOutput(data.message || 'Flashcards generated successfully!');
      }
    } catch (error) {
      console.error('Failed to generate flashcards:', error);
      setOutput(`Error: ${error.message || 'Failed to generate flashcards'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetAdvice = async (text) => {
    setLoading(true);
    try {
      const data = await aiAPI.getStudyAdvice({ question: text });
      setOutput(data.advice || data.message || 'Advice generated successfully!');
    } catch (error) {
      console.error('Failed to get study advice:', error);
      setOutput(`Error: ${error.message || 'Failed to get study advice'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTextSubmit = async (text) => {
    setInputText(text);
    switch (activeTab) {
      case 'summary':
        await handleGenerateSummary(text);
        break;
      case 'plan':
        await handleGenerateStudyPlan(text);
        break;
      case 'flashcards':
        await handleGenerateFlashcards(text);
        break;
      case 'advice':
        await handleGetAdvice(text);
        break;
      default:
        break;
    }
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case 'summary':
        return 'Paste your study material here to get a summary...';
      case 'plan':
        return 'Enter a topic to generate a study plan (e.g., "React Hooks")...';
      case 'flashcards':
        return 'Enter a topic to generate flashcards (e.g., "Python Basics")...';
      case 'advice':
        return 'Ask a study-related question (e.g., "How to improve memory retention?")...';
      default:
        return 'Enter your text here...';
    }
  };

  const getLabel = () => {
    switch (activeTab) {
      case 'summary':
        return 'Text to Summarize:';
      case 'plan':
        return 'Topic for Study Plan:';
      case 'flashcards':
        return 'Topic for Flashcards:';
      case 'advice':
        return 'Your Question:';
      default:
        return 'Input:';
    }
  };

  return (
    <div className="ai-assistant-container">
      <header className="page-header">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <h1>🤖 AI Study Assistant</h1>
        <p>Get AI-powered help with summaries, study plans, flashcards, and advice</p>
      </header>

      <div className="ai-content">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => { setActiveTab('summary'); setOutput(''); }}
          >
            📝 Summary
          </button>
          <button
            className={`tab ${activeTab === 'plan' ? 'active' : ''}`}
            onClick={() => { setActiveTab('plan'); setOutput(''); }}
          >
            📋 Study Plan
          </button>
          <button
            className={`tab ${activeTab === 'flashcards' ? 'active' : ''}`}
            onClick={() => { setActiveTab('flashcards'); setOutput(''); }}
          >
            🎴 Flashcards
          </button>
          <button
            className={`tab ${activeTab === 'advice' ? 'active' : ''}`}
            onClick={() => { setActiveTab('advice'); setOutput(''); }}
          >
            💡 Advice
          </button>
        </div>

        <TextInput
          label={getLabel()}
          placeholder={getPlaceholder()}
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
