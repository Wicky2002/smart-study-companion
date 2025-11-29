import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { analyticsAPI } from '../services/api';
import './Progress.css';

function Progress() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [timeRange, setTimeRange] = useState('week'); // week, month, all
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all analytics data
        const [overview, weeklyData, topicData, recommendations] = await Promise.all([
          analyticsAPI.getOverview(),
          analyticsAPI.getWeeklyProgress(),
          analyticsAPI.getTopicPerformance(),
          analyticsAPI.getRecommendations()
        ]);

        setAnalytics({
          totalStudyHours: overview.total_study_hours || 0,
          sessionsCompleted: overview.session_count || 0,
          topicsStudied: overview.unique_topics || 0,
          averageSessionLength: overview.avg_session_duration || 0,
          topicPerformance: topicData.topics || [],
          weeklyProgress: weeklyData.days || [],
          recommendations: recommendations.recommendations || []
        });
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        setError('Failed to load analytics data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange, navigate, isAuthenticated]);

  if (loading) {
    return (
      <div className="progress-container">
        <header className="page-header">
          <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
          <h1>📈 Progress & Analytics</h1>
        </header>
        <div className="loading-state">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="progress-container">
        <header className="page-header">
          <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
          <h1>📈 Progress & Analytics</h1>
        </header>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!analytics) {
    return <div className="progress-container">No data available.</div>;
  }

  const maxHours = analytics.weeklyProgress.length > 0 
    ? Math.max(...analytics.weeklyProgress.map(d => d.hours || 0))
    : 1;

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
            <div className="stat-value">{Math.round(analytics.averageSessionLength)} min</div>
            <div className="stat-label">Avg Session Length</div>
          </div>
        </div>

        {analytics.weeklyProgress.length > 0 && (
          <div className="chart-section">
            <h3>Weekly Study Hours</h3>
            <div className="bar-chart">
              {analytics.weeklyProgress.map((day, index) => (
                <div key={index} className="bar-container">
                  <div className="bar-wrapper">
                    <div
                      className="bar"
                      style={{ height: `${((day.hours || 0) / maxHours) * 100}%` }}
                    >
                      <span className="bar-value">{day.hours || 0}h</span>
                    </div>
                  </div>
                  <div className="bar-label">{day.day || day.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {analytics.topicPerformance.length > 0 && (
          <div className="topic-performance-section">
            <h3>Topic Performance</h3>
            <div className="performance-list">
              {analytics.topicPerformance.map((topic, index) => (
                <div key={index} className="performance-item">
                  <div className="performance-header">
                    <span className="topic-name">{topic.topic}</span>
                    <span className="topic-stats">
                      {topic.session_count || topic.sessions} sessions • {topic.total_hours || topic.hours}h
                    </span>
                  </div>
                  <div className="accuracy-bar">
                    <div
                      className="accuracy-fill"
                      style={{ width: `${topic.completion_rate || topic.accuracy || 0}%` }}
                    >
                      <span className="accuracy-text">{Math.round(topic.completion_rate || topic.accuracy || 0)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {analytics.recommendations.length > 0 && (
          <div className="recommendations-section">
            <h3>💡 Recommendations</h3>
            <ul className="recommendations-list">
              {analytics.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Progress;
