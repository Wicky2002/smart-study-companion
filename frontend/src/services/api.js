// API configuration and utility functions
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (response.status === 401) {
    // Token expired, try to refresh
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    throw new Error('RETRY_REQUEST');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || error.error || 'Request failed');
  }

  return response.json();
};

// Refresh access token
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('accessToken', data.access);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
};

// Generic API request function with retry logic
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    if (error.message === 'RETRY_REQUEST') {
      // Retry the request with new token
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    }
    throw error;
  }
};

// ============================================
// AUTHENTICATION API
// ============================================

export const authAPI = {
  // Sign up
  signup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Login
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await handleResponse(response);
    
    // Store tokens
    if (data.access && data.refresh) {
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
    }
    
    return data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userName');
  },
};

// ============================================
// STUDY SESSIONS API
// ============================================

export const sessionsAPI = {
  // Get all sessions
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/api/sessions/${queryString ? `?${queryString}` : ''}`);
  },

  // Get single session
  get: (id) => apiRequest(`/api/sessions/${id}/`),

  // Create session
  create: (sessionData) =>
    apiRequest('/api/sessions/', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    }),

  // Update session
  update: (id, sessionData) =>
    apiRequest(`/api/sessions/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(sessionData),
    }),

  // Delete session
  delete: (id) =>
    apiRequest(`/api/sessions/${id}/`, {
      method: 'DELETE',
    }),
};

// ============================================
// NOTES API
// ============================================

export const notesAPI = {
  // Get all notes
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/api/notes/${queryString ? `?${queryString}` : ''}`);
  },

  // Get single note
  get: (id) => apiRequest(`/api/notes/${id}/`),

  // Create note
  create: (noteData) =>
    apiRequest('/api/notes/', {
      method: 'POST',
      body: JSON.stringify(noteData),
    }),

  // Update note
  update: (id, noteData) =>
    apiRequest(`/api/notes/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(noteData),
    }),

  // Delete note
  delete: (id) =>
    apiRequest(`/api/notes/${id}/`, {
      method: 'DELETE',
    }),
};

// ============================================
// AI ASSISTANT API
// ============================================

export const aiAPI = {
  // Generate study plan
  generateStudyPlan: (planData) =>
    apiRequest('/api/ai/generate/study-plan/', {
      method: 'POST',
      body: JSON.stringify(planData),
    }),

  // Generate summary
  generateSummary: (content) =>
    apiRequest('/api/ai/generate/summary/', {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  // Generate flashcards
  generateFlashcards: (data) =>
    apiRequest('/api/ai/generate/flashcards/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Get study advice
  getAdvice: (data) =>
    apiRequest('/api/ai/generate/advice/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============================================
// ANALYTICS API
// ============================================

export const analyticsAPI = {
  // Get overview statistics
  getOverview: () => apiRequest('/api/analytics/overview/'),

  // Get weekly progress
  getWeeklyProgress: () => apiRequest('/api/analytics/weekly/'),

  // Get topic performance
  getTopicPerformance: () => apiRequest('/api/analytics/topics/'),

  // Get recommendations
  getRecommendations: () => apiRequest('/api/analytics/recommendations/'),
};

// ============================================
// AI REQUEST LOGS API
// ============================================

export const aiLogsAPI = {
  // Get all logs
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/api/ailogs/${queryString ? `?${queryString}` : ''}`);
  },

  // Get single log
  get: (id) => apiRequest(`/api/ailogs/${id}/`),
};

export default {
  auth: authAPI,
  sessions: sessionsAPI,
  notes: notesAPI,
  ai: aiAPI,
  analytics: analyticsAPI,
  aiLogs: aiLogsAPI,
};
