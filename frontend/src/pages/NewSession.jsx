import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NewSession.css';

function NewSession() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    topic: '',
    duration_minutes: 30,
    difficulty: 'intermediate',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // TODO: Connect to backend API
    // const response = await fetch('http://localhost:8000/api/study/sessions/', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`
    //   },
    //   body: JSON.stringify(formData)
    // });
    
    console.log('Creating session:', formData);
    alert('Session created! (Mock - backend not connected)');
    navigate('/sessions');
  };

  return (
    <div className="new-session-container">
      <header className="page-header">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <h1>🚀 Start New Study Session</h1>
        <p>Create a focused study session to track your progress</p>
      </header>

      <div className="session-form-container">
        <form onSubmit={handleSubmit} className="session-form">
          <div className="form-group">
            <label htmlFor="topic">Topic *</label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="e.g., React Hooks, Calculus, Spanish Grammar"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration_minutes">Duration (minutes) *</label>
              <select
                id="duration_minutes"
                name="duration_minutes"
                value={formData.duration_minutes}
                onChange={handleChange}
                required
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="difficulty">Difficulty</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Session Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any notes or goals for this session..."
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/dashboard')} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Start Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewSession;
