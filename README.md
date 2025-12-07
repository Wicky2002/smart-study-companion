# 🎓 Smart Study Companion

A full-stack web application that helps students organize their study sessions, take notes, and leverage AI for personalized learning assistance.

## ✨ Features

### 📚 Study Session Management
- Create and track study sessions with topics, duration, and difficulty
- Filter sessions by status (active/completed)
- View detailed session history

### 📝 Note Taking
- Create, edit, and delete study notes
- Organize notes by related topics
- Search and filter functionality

### 🤖 AI-Powered Study Assistant
- **Text Summarization**: Get concise summaries of study materials using BART model
- **Study Plan Generation**: Create personalized study schedules with GPT-2
- **Flashcard Generation**: Auto-generate flashcards from topics
- **Study Advice**: Get AI-powered study tips and recommendations
- **Question Answering**: Ask questions about your study content and get AI answers
- **Sentiment Analysis**: Analyze the sentiment of your study notes
- **Keyword Extraction**: Identify important keywords and concepts
- **Quiz Generation**: Generate multiple-choice quizzes from study materials

### 📊 Progress Analytics
- Track total study hours and session count
- View weekly progress charts
- Analyze performance by topic
- Get personalized recommendations depending on the input

### 🔐 User Authentication
- Secure JWT-based authentication
- User signup and login
- Protected routes and API endpoints

---

## 🏗️ Tech Stack

### Backend
- **Django 5.2.8** - Web framework
- **Django REST Framework 3.16.1** - API development
- **Simple JWT 5.5.1** - JWT authentication
- **SQLite3** - Database (production-ready for PostgreSQL)
- **django-cors-headers** - CORS handling
- **django-filter** - Advanced filtering
- **drf-yasg** - API documentation (Swagger/ReDoc)
- **🤖 AI Models**:
  - **Transformers 4.36.0** - Hugging Face ML library
  - **PyTorch 2.1.2** - Deep learning framework
  - **BART (facebook/bart-large-cnn)** - Text summarization
  - **GPT-2** - Text generation for study plans
  - **DistilBERT** - Question answering and sentiment analysis

### Frontend
- **React 19.2.0** - UI framework
- **Vite** - Build tool and dev server
- **React Router 7.9.6** - Client-side routing
- **CSS3** - Styling

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation & Running

#### 1. Backend Setup
```powershell
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
Backend runs on: **http://localhost:8000**

**Note**: First-time installation will download AI models (~2GB) on first API call to AI endpoints. This is a one-time process.

#### 2. Frontend Setup
```powershell
cd frontend
npm install
npm run dev
```
Frontend runs on: **http://localhost:5173**

#### 3. Open Application
Navigate to: **http://localhost:5173**

---

## 📖 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get up and running in minutes
- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** - Complete integration documentation
- **[INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md)** - Architecture and features overview
- **[AI README](backend/ai/README_AI.md)** - 🤖 AI Features, models, and customization
- **[BACKEND_FEATURES_IMPLEMENTED.md](backend/BACKEND_FEATURES_IMPLEMENTED.md)** - Backend API details
- **[API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)** - API endpoints reference

### API Documentation (Interactive)
When backend is running:
- **Swagger UI**: http://localhost:8000/swagger/
- **ReDoc**: http://localhost:8000/redoc/

---

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/signup/` - Register new user
- `POST /api/auth/login/` - Login and get JWT tokens
- `POST /api/auth/logout/` - Logout (blacklist refresh token)
- `POST /api/auth/token/refresh/` - Refresh access token

### Study Sessions
- `GET /api/sessions/` - List sessions (with filtering & pagination)
- `POST /api/sessions/` - Create session
- `GET /api/sessions/{id}/` - Get session details
- `PUT /api/sessions/{id}/` - Update session
- `DELETE /api/sessions/{id}/` - Delete session

### Study Notes
- `GET /api/notes/` - List notes (with search & pagination)
- `POST /api/notes/` - Create note
- `GET /api/notes/{id}/` - Get note details
- `PUT /api/notes/{id}/` - Update note
- `DELETE /api/notes/{id}/` - Delete note

### AI Assistant
- `POST /api/ai/generate-summary/` - Generate text summary (BART model)
- `POST /api/ai/generate-study-plan/` - Create study plan (GPT-2)
- `POST /api/ai/generate-flashcards/` - Generate flashcards
- `POST /api/ai/get-study-advice/` - Get study advice
- `POST /api/ai/answer-question/` - Answer questions from context (DistilBERT)
- `POST /api/ai/analyze-sentiment/` - Analyze study note sentiment
- `POST /api/ai/extract-keywords/` - Extract important keywords
- `POST /api/ai/generate/quiz/` - Generate multiple-choice quizzes

### Analytics
- `GET /api/analytics/overview/` - Overall statistics
- `GET /api/analytics/weekly-progress/` - Weekly study hours
- `GET /api/analytics/topic-performance/` - Performance by topic
- `GET /api/analytics/recommendations/` - AI recommendations

---

## 📁 Project Structure

```
smart-study-companion/
├── backend/                    # Django backend
│   ├── core/                   # Main project settings
│   │   ├── settings.py         # Django configuration
│   │   └── urls.py             # Main URL routing
│   ├── accounts/               # User authentication
│   ├── study/                  # Sessions and notes
│   ├── ai/                     # AI assistant features
│   ├── analytics/              # Progress analytics
│   ├── manage.py               # Django CLI
│   └── requirements.txt        # Python dependencies
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── contexts/           # React context providers
│   │   │   └── AuthContext.jsx # Authentication state
│   │   ├── pages/              # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Sessions.jsx
│   │   │   ├── Notes.jsx
│   │   │   ├── AIAssistant.jsx
│   │   │   └── Progress.jsx
│   │   ├── services/           # API services
│   │   │   └── api.js          # API client
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   ├── package.json            # Node dependencies
│   └── vite.config.js          # Vite configuration
│
└── README.md                   # This file
```

---

## 🔐 Authentication Flow

1. **User signs up or logs in** → Backend returns JWT tokens (access + refresh)
2. **Tokens stored in localStorage** → Frontend includes in all API requests
3. **Access token expires** → Frontend auto-refreshes using refresh token
4. **User logs out** → Tokens cleared and refresh token blacklisted

---

## 🎨 Features Integrated

| Feature | Status | Frontend | Backend |
|---------|--------|----------|---------|
| User Authentication | ✅ | `Login.jsx`, `Signup.jsx` | `/api/auth/*` |
| Dashboard Analytics | ✅ | `Dashboard.jsx` | `/api/analytics/overview/` |
| Session Management | ✅ | `Sessions.jsx`, `NewSession.jsx` | `/api/sessions/*` |
| Note Taking | ✅ | `Notes.jsx` | `/api/notes/*` |
| AI Text Summary | ✅ | `AIAssistant.jsx` | `/api/ai/generate-summary/` |
| AI Study Plan | ✅ | `AIAssistant.jsx` | `/api/ai/generate-study-plan/` |
| AI Flashcards | ✅ | `AIAssistant.jsx` | `/api/ai/generate-flashcards/` |
| AI Study Advice | ✅ | `AIAssistant.jsx` | `/api/ai/get-study-advice/` |
| Progress Tracking | ✅ | `Progress.jsx` | `/api/analytics/*` |

---

## 🧪 Testing

### Manual Testing
1. Start both backend and frontend servers
2. Open http://localhost:5173
3. Create an account and login
4. Test each feature:
   - Create study sessions
   - Add and edit notes
   - Use AI assistant features
   - View progress analytics

### Admin Panel
Create a superuser to access Django admin:
```powershell
cd backend
python manage.py createsuperuser
```
Access: http://localhost:8000/admin/

---

## 🔧 Configuration

### Backend Environment Variables
Create `backend/.env` (optional, has defaults):
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
OPENAI_API_KEY=your-openai-key-here  # For AI features
```

### Frontend Environment Variables
Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000
```

---

## 🚧 Known Limitations

- SQLite database (switch to PostgreSQL for production)
- Single user mode (no multi-tenancy)
- No real-time features (WebSocket not implemented)
- AI models require initial download (~2GB) on first use
- AI processing may be slower on low-end hardware (CPU-based)

---

## 📈 Future Enhancements

- [ ] GPU acceleration for faster AI processing
- [ ] Additional AI models (question answering, concept extraction)
- [ ] Real-time collaboration with WebSockets
- [ ] Mobile app (React Native)
- [ ] Spaced repetition algorithm for flashcards
- [ ] Calendar integration for study scheduling
- [ ] Export notes as PDF/Markdown
- [ ] Study streak tracking and gamification
- [ ] Social features (study groups, sharing)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Authors

- **[Wicky2002](https://github.com/Wicky2002)**
- **[Lilvamp237](https://github.com/Lilvamp237)**

---

## 🙏 Acknowledgments

- Django REST Framework documentation
- React and Vite communities
- OpenAI for AI capabilities inspiration

---

## 📞 Support

For issues or questions:
1. Check existing [GitHub Issues](https://github.com/Wicky2002/smart-study-companion/issues)
2. Review documentation files
3. Create a new issue with detailed description

---

**⭐ If you find this project helpful, please star the repository!**