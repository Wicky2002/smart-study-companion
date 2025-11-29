import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { sessionsAPI } from '../services/api';
import './Sessions.css';

function Sessions() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState('all'); // all, completed, active
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await sessionsAPI.getAll();
        setSessions(data.results || data);
      } catch (err) {
        console.error('Failed to fetch sessions:', err);
        setError('Failed to load sessions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [navigate, isAuthenticated]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredSessions = sessions.filter(session => {
    if (filter === 'completed') return session.completed;
    if (filter === 'active') return !session.completed;
    return true;
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await sessionsAPI.delete(id);
        setSessions(sessions.filter(s => s.id !== id));
      } catch (err) {
        console.error('Failed to delete session:', err);
        alert('Failed to delete session. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="sessions-container">
        <header className="page-header">
          <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
          <h1>📋 Study Sessions</h1>
        </header>
        <div className="loading-state">Loading sessions...</div>
      </div>
    );
  }

  return (
    <div className="sessions-container">
      <header className="page-header">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <h1>📋 Study Sessions</h1>
        <p>View and manage your study sessions</p>
      </header>

      <div className="sessions-content">
        {error && <div className="error-message">{error}</div>}
        
        <div className="sessions-toolbar">
          <div className="filter-buttons">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All ({sessions.length})
            </button>
            <button
              className={filter === 'active' ? 'active' : ''}
              onClick={() => setFilter('active')}
            >
              Active ({sessions.filter(s => !s.completed).length})
            </button>
            <button
              className={filter === 'completed' ? 'active' : ''}
              onClick={() => setFilter('completed')}
            >
              Completed ({sessions.filter(s => s.completed).length})
            </button>
          </div>
          <Link to="/new-session" className="btn-new-session">+ New Session</Link>
        </div>

        <div className="sessions-list">
          {filteredSessions.length === 0 ? (
            <div className="empty-state">
              <p>No sessions found.</p>
              <Link to="/new-session" className="btn-create-first">Create Your First Session</Link>
            </div>
          ) : (
            <table className="sessions-table">
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Duration</th>
                  <th>Difficulty</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map(session => (
                  <tr key={session.id}>
                    <td className="topic-cell">{session.topic}</td>
                    <td>{session.duration_minutes} min</td>
                    <td>
                      <span className={`badge badge-${session.difficulty}`}>
                        {session.difficulty}
                      </span>
                    </td>
                    <td className="date-cell">{formatDate(session.created_at)}</td>
                    <td>
                      <span className={`status ${session.completed ? 'completed' : 'active'}`}>
                        {session.completed ? '✓ Completed' : '○ Active'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button className="btn-icon" title="View Details">👁️</button>
                      <button className="btn-icon" title="Edit">✏️</button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(session.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sessions;
