import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [userName] = useState(() => localStorage.getItem('userName') || 'Student');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  // Mock stats data
  const stats = {
    totalHours: 24,
    topicsCompleted: 12,
    quizzesTaken: 8,
    avgAccuracy: 85
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Smart Study Companion</h1>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </header>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Hello, {userName}! 👋</h2>
          <p>Ready to continue your learning journey?</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-value">{stats.totalHours}h</div>
            <div className="stat-label">Total Study Hours</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-value">{stats.topicsCompleted}</div>
            <div className="stat-label">Topics Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✍️</div>
            <div className="stat-value">{stats.quizzesTaken}</div>
            <div className="stat-label">Quizzes Taken</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{stats.avgAccuracy}%</div>
            <div className="stat-label">Avg Accuracy</div>
          </div>
        </div>

        <div className="features-grid">
          <Link to="/new-session" className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Start New Session</h3>
            <p>Begin a new study session</p>
          </Link>

          <Link to="/sessions" className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>View Sessions</h3>
            <p>See your past study sessions</p>
          </Link>

          <Link to="/ai-assistant" className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Assistant</h3>
            <p>Get summaries and quizzes</p>
          </Link>

          <Link to="/notes" className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Notes</h3>
            <p>Manage your study notes</p>
          </Link>

          <Link to="/progress" className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Progress</h3>
            <p>Track your learning progress</p>
          </Link>

          <Link to="/schedule" className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Schedule</h3>
            <p>Plan your study time</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
