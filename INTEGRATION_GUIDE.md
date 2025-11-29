# Frontend-Backend Integration Guide

## Overview
This guide explains how the Smart Study Companion frontend (React) connects to the backend (Django REST API).

## 🎯 What's Been Connected

### Authentication System ✅
- **Login**: `frontend/src/pages/Login.jsx` → `/api/auth/login/`
- **Signup**: `frontend/src/pages/Signup.jsx` → `/api/auth/signup/`
- **Logout**: `AuthContext` → `/api/auth/logout/`
- **Token Management**: JWT tokens stored in localStorage with auto-refresh

### Dashboard ✅
- **Analytics Overview**: `frontend/src/pages/Dashboard.jsx` → `/api/analytics/overview/`
- Shows: Total study hours, topics studied, session count, completion rate

### Study Sessions ✅
- **List Sessions**: `frontend/src/pages/Sessions.jsx` → `/api/sessions/`
- **Create Session**: `frontend/src/pages/NewSession.jsx` → `/api/sessions/` (POST)
- **Delete Session**: Sessions page → `/api/sessions/{id}/` (DELETE)
- Filtering by status (all, active, completed)

### Study Notes ✅
- **List Notes**: `frontend/src/pages/Notes.jsx` → `/api/notes/`
- **Create Note**: Notes page → `/api/notes/` (POST)
- **Update Note**: Notes page → `/api/notes/{id}/` (PUT)
- **Delete Note**: Notes page → `/api/notes/{id}/` (DELETE)

### AI Assistant ✅
- **Generate Summary**: `frontend/src/pages/AIAssistant.jsx` → `/api/ai/generate-summary/`
- **Study Plan**: AIAssistant page → `/api/ai/generate-study-plan/`
- **Flashcards**: AIAssistant page → `/api/ai/generate-flashcards/`
- **Study Advice**: AIAssistant page → `/api/ai/get-study-advice/`

### Progress Analytics ✅
- **Overview**: `frontend/src/pages/Progress.jsx` → `/api/analytics/overview/`
- **Weekly Progress**: Progress page → `/api/analytics/weekly-progress/`
- **Topic Performance**: Progress page → `/api/analytics/topic-performance/`
- **Recommendations**: Progress page → `/api/analytics/recommendations/`

---

## 🚀 How to Run the Application

### Backend Setup

1. **Navigate to backend directory**:
   ```powershell
   cd backend
   ```

2. **Activate virtual environment** (if you have one):
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

3. **Install dependencies** (if not already installed):
   ```powershell
   pip install -r requirements.txt
   ```

4. **Run migrations** (if needed):
   ```powershell
   python manage.py migrate
   ```

5. **Start the Django server**:
   ```powershell
   python manage.py runserver
   ```
   
   Backend will run on: `http://localhost:8000`

### Frontend Setup

1. **Open a new terminal** and navigate to frontend:
   ```powershell
   cd frontend
   ```

2. **Install dependencies** (if not already installed):
   ```powershell
   npm install
   ```

3. **Start the development server**:
   ```powershell
   npm run dev
   ```
   
   Frontend will run on: `http://localhost:5173`

4. **Open your browser** and go to: `http://localhost:5173`

---

## 🔧 Configuration

### Environment Variables

**Backend** (`backend/.env` - optional, has defaults):
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
DATABASE_URL=sqlite:///db.sqlite3
OPENAI_API_KEY=your-openai-key-here
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:8000
```

### Proxy Configuration

The frontend uses Vite's proxy to avoid CORS issues during development:

**File**: `frontend/vite.config.js`
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true
    }
  }
}
```

---

## 🔐 Authentication Flow

1. **User Signs Up/Logs In**
   - Frontend sends credentials to `/api/auth/signup/` or `/api/auth/login/`
   - Backend returns JWT access and refresh tokens
   - Tokens stored in `localStorage`

2. **Authenticated Requests**
   - Frontend includes `Authorization: Bearer {token}` header
   - API service (`frontend/src/services/api.js`) handles this automatically

3. **Token Refresh**
   - When access token expires (401 error)
   - API service automatically calls `/api/auth/token/refresh/`
   - Retries original request with new token

4. **Logout**
   - Frontend calls `/api/auth/logout/` with refresh token
   - Clears tokens from localStorage
   - Redirects to login page

---

## 📡 API Service Layer

**File**: `frontend/src/services/api.js`

All API calls go through this centralized service:

```javascript
import { authAPI, sessionsAPI, notesAPI, aiAPI, analyticsAPI } from './services/api';

// Example usage:
const sessions = await sessionsAPI.getAll();
const note = await notesAPI.create({ title: 'My Note', content: '...' });
const summary = await aiAPI.generateSummary({ text: '...' });
```

Features:
- Automatic token attachment
- Token refresh on 401 errors
- Error handling
- Retry logic

---

## 🎨 Context Providers

### AuthContext

**File**: `frontend/src/contexts/AuthContext.jsx`

Provides global authentication state:

```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout, signup } = useAuth();
  
  // Use authentication functions
}
```

The `AuthContext` wraps the entire app in `App.jsx`.

---

## 🧪 Testing the Integration

### 1. Test Authentication
1. Start both servers
2. Go to `http://localhost:5173`
3. Click "Sign Up" and create an account
4. Verify you're redirected to Dashboard
5. Log out and log back in

### 2. Test Sessions
1. Click "Start New Session" from Dashboard
2. Fill in topic, duration, difficulty
3. Submit and verify it appears in Sessions list
4. Try filtering (All, Active, Completed)
5. Delete a session

### 3. Test Notes
1. Go to Notes page
2. Create a new note with title and content
3. Edit the note
4. Delete the note

### 4. Test AI Assistant
1. Go to AI Assistant page
2. Try each tab:
   - **Summary**: Paste text and generate summary
   - **Study Plan**: Enter topic for study plan
   - **Flashcards**: Generate flashcards
   - **Advice**: Ask study questions

### 5. Test Progress
1. Go to Progress page
2. Verify stats display correctly
3. Check weekly progress chart
4. View topic performance
5. Read AI recommendations

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError`
```powershell
pip install -r requirements.txt
```

**Problem**: Database errors
```powershell
python manage.py migrate
python manage.py makemigrations
python manage.py migrate
```

**Problem**: Port 8000 already in use
```powershell
# Find and kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Frontend Issues

**Problem**: `npm install` fails
```powershell
# Clear cache and reinstall
npm cache clean --force
rm -r node_modules
rm package-lock.json
npm install
```

**Problem**: Port 5173 already in use
```powershell
# Find and kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Problem**: CORS errors
- Check `backend/core/settings.py` includes `http://localhost:5173` in `CORS_ALLOWED_ORIGINS`
- Verify both servers are running
- Clear browser cache

**Problem**: 401 Unauthorized errors
- Check tokens in browser DevTools → Application → Local Storage
- Try logging out and back in
- Verify backend is running

---

## 📝 API Endpoints Reference

### Authentication
- `POST /api/auth/signup/` - Register new user
- `POST /api/auth/login/` - Login and get tokens
- `POST /api/auth/logout/` - Logout (blacklist refresh token)
- `POST /api/auth/token/refresh/` - Refresh access token

### Study Sessions
- `GET /api/sessions/` - List all sessions (paginated)
- `POST /api/sessions/` - Create new session
- `GET /api/sessions/{id}/` - Get session details
- `PUT /api/sessions/{id}/` - Update session
- `DELETE /api/sessions/{id}/` - Delete session

### Study Notes
- `GET /api/notes/` - List all notes (paginated)
- `POST /api/notes/` - Create new note
- `GET /api/notes/{id}/` - Get note details
- `PUT /api/notes/{id}/` - Update note
- `DELETE /api/notes/{id}/` - Delete note

### AI Assistant
- `POST /api/ai/generate-summary/` - Generate text summary
- `POST /api/ai/generate-study-plan/` - Create study plan
- `POST /api/ai/generate-flashcards/` - Generate flashcards
- `POST /api/ai/get-study-advice/` - Get study advice

### Analytics
- `GET /api/analytics/overview/` - Overall statistics
- `GET /api/analytics/weekly-progress/` - Weekly study hours
- `GET /api/analytics/topic-performance/` - Performance by topic
- `GET /api/analytics/recommendations/` - AI-generated recommendations

---

## 🎓 Additional Resources

- **Backend Documentation**: `/swagger/` or `/redoc/` (when server running)
- **Django REST Framework**: https://www.django-rest-framework.org/
- **React Router**: https://reactrouter.com/
- **Vite**: https://vitejs.dev/

---

## ✅ Next Steps

1. **Create Admin User** (optional):
   ```powershell
   cd backend
   python manage.py createsuperuser
   ```
   Access admin panel at: `http://localhost:8000/admin/`

2. **Test All Features**: Go through each page and test functionality

3. **Add Real Data**: Create sessions, notes, and use AI features

4. **Monitor API**: Check `/swagger/` for API documentation

5. **Production Deployment**: See `DEPLOYMENT.md` for production setup

---

**🎉 Congratulations! Your frontend and backend are now fully integrated!**
