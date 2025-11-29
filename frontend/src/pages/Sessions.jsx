import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Sessions.css';

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState('all'); // all, completed, active

  useEffect(() => {
    // TODO: Fetch from backend
    // fetch('http://localhost:8000/api/study/sessions/', {
    //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    // }).then(res => res.json()).then(data => setSessions(data));

    // Mock data
    const mockSessions = [
      {
        id: 1,
        topic: 'React Hooks',
        duration_minutes: 60,
        difficulty: 'intermediate',
        created_at: '2025-11-25T10:00:00Z',
        completed: true
      },
      {
        id: 2,
        topic: 'Python Decorators',
        duration_minutes: 45,
        difficulty: 'advanced',
        created_at: '2025-11-26T14:30:00Z',
        completed: false
      },
      {
        id: 3,
        topic: 'CSS Grid Layout',
        duration_minutes: 30,
        difficulty: 'beginner',
        created_at: '2025-11-27T09:15:00Z',
        completed: true
      }
    ];
    setSessions(mockSessions);
  }, []);

  const filteredSessions = sessions.filter(session => {
    if (filter === 'completed') return session.completed;
    if (filter === 'active') return !session.completed;
    return true;
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      // TODO: API call to delete
      setSessions(sessions.filter(s => s.id !== id));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="sessions-container">
      <header className="page-header">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <h1>📋 Study Sessions</h1>
        <p>View and manage your study sessions</p>
      </header>

      <div className="sessions-content">
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
