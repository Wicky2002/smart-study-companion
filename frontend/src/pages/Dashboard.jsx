import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { analyticsAPI } from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalHours: 0,
    topicsCompleted: 0,
    session_count: 0,
    completion_rate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Fetch analytics data
    const fetchStats = async () => {
      try {
        const data = await analyticsAPI.getOverview();
        setStats({
          totalHours: data.total_study_hours || 0,
          topicsCompleted: data.unique_topics || 0,
          session_count: data.session_count || 0,
          completion_rate: data.completion_rate || 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate, isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Smart Study Companion</h1>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </header>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Hello, {user?.username || 'Student'}! 👋</h2>
          <p>Ready to continue your learning journey?</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-value">{loading ? '...' : `${stats.totalHours}h`}</div>
            <div className="stat-label">Total Study Hours</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-value">{loading ? '...' : stats.topicsCompleted}</div>
            <div className="stat-label">Topics Studied</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✍️</div>
            <div className="stat-value">{loading ? '...' : stats.session_count}</div>
            <div className="stat-label">Study Sessions</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{loading ? '...' : `${Math.round(stats.completion_rate)}%`}</div>
            <div className="stat-label">Completion Rate</div>
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
