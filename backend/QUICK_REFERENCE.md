# 🚀 Smart Study Companion - Quick API Reference

## Base URL
```
http://localhost:8000
```

## 🔐 Authentication

### Sign Up
```bash
POST /api/auth/signup/
{"username": "user", "email": "user@example.com", "password": "pass123"}
```

### Login
```bash
POST /api/auth/login/
{"username": "user", "password": "pass123"}
# Returns: {"access": "...", "refresh": "..."}
```

### Refresh Token
```bash
POST /api/auth/token/refresh/
{"refresh": "your-refresh-token"}
```

### Use Token
```bash
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## 📚 Study Sessions

```bash
# List all sessions (with pagination)
GET /api/sessions/

# Filter sessions
GET /api/sessions/?topic=math&difficulty=hard&completed=true&date=2025-01-10

# Create session
POST /api/sessions/
{"topic": "Calculus", "duration_minutes": 60, "difficulty": "medium", "completed": false}

# Get specific session
GET /api/sessions/123/

# Update session
PUT /api/sessions/123/
{"topic": "Calculus", "duration_minutes": 90, "difficulty": "hard", "completed": true}

# Delete session
DELETE /api/sessions/123/
```

---

## 📝 Study Notes

```bash
# List all notes
GET /api/notes/

# Search notes
GET /api/notes/?search=calculus

# Filter notes
GET /api/notes/?title=Chapter&related_topic=physics

# Create note
POST /api/notes/
{"title": "Derivatives", "content": "A derivative represents...", "related_topic": "Calculus"}

# Get specific note
GET /api/notes/456/

# Update note
PUT /api/notes/456/
{"title": "Updated Title", "content": "Updated content..."}

# Delete note
DELETE /api/notes/456/
```

---

## 🤖 AI Assistant

### Generate Study Plan
```bash
POST /api/ai/generate/study-plan/
{
  "topic": "Physics",
  "duration_days": 7,
  "difficulty": "intermediate"
}
```

### Summarize Content
```bash
POST /api/ai/generate/summary/
{
  "content": "Long study content to summarize..."
}
```

### Generate Flashcards
```bash
POST /api/ai/generate/flashcards/
{
  "content": "Study content for flashcards...",
  "num_cards": 5
}
```

### Get Study Advice
```bash
POST /api/ai/generate/advice/
{
  "current_topic": "Chemistry",
  "struggles": "Understanding molecular bonds"
}
```

**Note:** All AI endpoints are rate-limited to 10 requests/minute

---

## 📊 Analytics

### Overall Statistics
```bash
GET /api/analytics/overview/
# Returns: total time, sessions, completion rate, topics, notes count
```

### Weekly Progress
```bash
GET /api/analytics/weekly/
# Returns: Daily breakdown for past 7 days
```

### Topic Performance
```bash
GET /api/analytics/topics/
# Returns: Stats grouped by topic
```

### Study Recommendations
```bash
GET /api/analytics/recommendations/
# Returns: Personalized study tips based on your data
```

---

## 🔍 Advanced Queries

### Pagination
```bash
GET /api/sessions/?page=2
```

### Ordering
```bash
GET /api/sessions/?ordering=-created_at  # Descending
GET /api/sessions/?ordering=duration_minutes  # Ascending
```

### Multiple Filters
```bash
GET /api/sessions/?topic=math&completed=false&min_duration=30&ordering=-created_at
```

### Date Range
```bash
GET /api/sessions/?date=2025-01-10
```

---

## 📖 Documentation

### Swagger UI (Interactive)
```
http://localhost:8000/swagger/
```

### ReDoc (Beautiful)
```
http://localhost:8000/redoc/
```

### Admin Panel
```
http://localhost:8000/admin/
```

---

## 🧪 Quick Test

### 1. Test API is Running
```bash
curl http://localhost:8000/api/hello/
```

### 2. Sign Up
```bash
curl -X POST http://localhost:8000/api/auth/signup/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'
```

### 3. Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'
```

### 4. Create Session (use token from login)
```bash
curl -X POST http://localhost:8000/api/sessions/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"topic":"Math","duration_minutes":60,"difficulty":"medium"}'
```

### 5. Get Analytics
```bash
curl -X GET http://localhost:8000/api/analytics/overview/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## ⚡ Response Formats

### Success (200/201)
```json
{
  "id": 1,
  "topic": "Calculus",
  "duration_minutes": 60,
  "difficulty": "medium",
  "completed": false,
  "created_at": "2025-01-10T10:00:00Z"
}
```

### Error (400)
```json
{
  "duration_minutes": ["Duration must be greater than 0 minutes."],
  "topic": ["Topic cannot be empty."]
}
```

### Paginated Response
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/sessions/?page=2",
  "previous": null,
  "results": [...]
}
```

---

## 🎯 Common Use Cases

### Track Study Session
1. Login to get token
2. POST to `/api/sessions/` with study details
3. Mark as completed: PATCH `/api/sessions/{id}/` with `{"completed": true}`

### Take Notes
1. Login to get token
2. POST to `/api/notes/` with title and content
3. Link to topic: include `"related_topic": "Math"`

### Get Study Insights
1. Login to get token
2. GET `/api/analytics/overview/` for overall stats
3. GET `/api/analytics/weekly/` for weekly progress
4. GET `/api/analytics/recommendations/` for tips

### Use AI Features
1. Login to get token
2. POST to any `/api/ai/generate/*` endpoint
3. AI response is automatically logged in `/api/ailogs/`

---

## 🔧 Rate Limits

- Anonymous users: 100 requests/day
- Authenticated users: 1000 requests/day
- AI endpoints: 10 requests/minute

---

## 🆘 Troubleshooting

### 401 Unauthorized
- Check if token is included in Authorization header
- Token might be expired, refresh it

### 429 Too Many Requests
- You've hit the rate limit
- Wait a minute (for AI endpoints) or try again later

### 400 Bad Request
- Check request body format
- Ensure required fields are provided
- Review validation errors in response

---

**For detailed documentation, visit:** `/swagger/` or `/redoc/`

*Quick Reference v1.0 - Last Updated: November 26, 2025*
