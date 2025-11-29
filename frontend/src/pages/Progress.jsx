import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Progress.css';

function Progress() {
  const [timeRange, setTimeRange] = useState('week'); // week, month, all
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    // TODO: Fetch from backend
    // fetch(`http://localhost:8000/api/analytics/${timeRange}/`, {
    //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    // }).then(res => res.json()).then(data => setAnalytics(data));

    // Mock data
    const mockAnalytics = {
      totalStudyHours: 24,
      sessionsCompleted: 12,
      topicsStudied: 8,
      averageSessionLength: 45,
      topicPerformance: [
        { topic: 'React', sessions: 5, hours: 8, accuracy: 85 },
        { topic: 'Python', sessions: 4, hours: 6, accuracy: 78 },
        { topic: 'CSS', sessions: 3, hours: 4, accuracy: 92 }
      ],
      weeklyProgress: [
        { day: 'Mon', hours: 2 },
        { day: 'Tue', hours: 3.5 },
        { day: 'Wed', hours: 1.5 },
        { day: 'Thu', hours: 4 },
        { day: 'Fri', hours: 3 },
        { day: 'Sat', hours: 5 },
        { day: 'Sun', hours: 2 }
      ],
      recommendations: [
        'Consider reviewing React concepts - accuracy could be improved',
        'Great consistency this week! Keep it up',
        'Try shorter, more focused sessions for better retention'
      ]
    };
    setAnalytics(mockAnalytics);
  }, [timeRange]);

  if (!analytics) {
    return <div className="progress-container">Loading...</div>;
  }

  const maxHours = Math.max(...analytics.weeklyProgress.map(d => d.hours));

  return (
    <div className="progress-container">
      <header className="page-header">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <h1>📈 Progress & Analytics</h1>
        <p>Track your learning journey</p>
      </header>

      <div className="progress-content">
        <div className="time-range-selector">
          <button
            className={timeRange === 'week' ? 'active' : ''}
            onClick={() => setTimeRange('week')}
          >
            This Week
          </button>
          <button
            className={timeRange === 'month' ? 'active' : ''}
            onClick={() => setTimeRange('month')}
          >
            This Month
          </button>
          <button
            className={timeRange === 'all' ? 'active' : ''}
            onClick={() => setTimeRange('all')}
          >
            All Time
          </button>
        </div>

        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-value">{analytics.totalStudyHours}h</div>
            <div className="stat-label">Total Study Time</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{analytics.sessionsCompleted}</div>
            <div className="stat-label">Sessions Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-value">{analytics.topicsStudied}</div>
            <div className="stat-label">Topics Studied</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏰</div>
            <div className="stat-value">{analytics.averageSessionLength} min</div>
            <div className="stat-label">Avg Session Length</div>
          </div>
        </div>

        <div className="chart-section">
          <h3>Weekly Study Hours</h3>
          <div className="bar-chart">
            {analytics.weeklyProgress.map((day, index) => (
              <div key={index} className="bar-container">
                <div className="bar-wrapper">
                  <div
                    className="bar"
                    style={{ height: `${(day.hours / maxHours) * 100}%` }}
                  >
                    <span className="bar-value">{day.hours}h</span>
                  </div>
                </div>
                <div className="bar-label">{day.day}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="topic-performance-section">
          <h3>Topic Performance</h3>
          <div className="performance-list">
            {analytics.topicPerformance.map((topic, index) => (
              <div key={index} className="performance-item">
                <div className="performance-header">
                  <span className="topic-name">{topic.topic}</span>
                  <span className="topic-stats">
                    {topic.sessions} sessions • {topic.hours}h
                  </span>
                </div>
                <div className="accuracy-bar">
                  <div
                    className="accuracy-fill"
                    style={{ width: `${topic.accuracy}%` }}
                  >
                    <span className="accuracy-text">{topic.accuracy}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="recommendations-section">
          <h3>💡 Recommendations</h3>
          <ul className="recommendations-list">
            {analytics.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Progress;
