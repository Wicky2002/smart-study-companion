# Smart Study Companion - API Documentation

## Base URL
```
http://localhost:8000/api/
```

## Authentication

The API uses JWT (JSON Web Token) authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-access-token>
```

### Authentication Endpoints

#### 1. Sign Up
- **URL:** `/api/auth/signup/`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "username": "user123",
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```

#### 2. Login
- **URL:** `/api/auth/login/`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "username": "user123",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
  ```

#### 3. Refresh Token
- **URL:** `/api/auth/token/refresh/`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "refresh": "your-refresh-token"
  }
  ```

---

## Study Sessions

### List/Create Sessions
- **URL:** `/api/sessions/`
- **Methods:** `GET`, `POST`
- **Filters:** `?topic=math&difficulty=hard&completed=true&date=2025-01-10`

### Get/Update/Delete Session
- **URL:** `/api/sessions/{id}/`
- **Methods:** `GET`, `PUT`, `PATCH`, `DELETE`

---

## Study Notes

### List/Create Notes
- **URL:** `/api/notes/`
- **Methods:** `GET`, `POST`
- **Search:** `?search=calculus`
- **Filters:** `?title=Chapter&related_topic=physics`

### Get/Update/Delete Note
- **URL:** `/api/notes/{id}/`
- **Methods:** `GET`, `PUT`, `PATCH`, `DELETE`

---

## AI Assistant

All AI endpoints require authentication and are rate-limited to 10 requests per minute.

#### 1. Generate Study Plan
- **URL:** `/api/ai/generate/study-plan/`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "topic": "Calculus",
    "duration_days": 7,
    "difficulty": "intermediate"
  }
  ```

#### 2. Generate Summary
- **URL:** `/api/ai/generate/summary/`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "content": "Your study content here..."
  }
  ```

#### 3. Generate Flashcards
- **URL:** `/api/ai/generate/flashcards/`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "content": "Your study content...",
    "num_cards": 5
  }
  ```

#### 4. Get Study Advice
- **URL:** `/api/ai/generate/advice/`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "current_topic": "Physics",
    "struggles": "Understanding quantum mechanics"
  }
  ```

---

## Analytics

All analytics endpoints return data for the authenticated user only.

#### 1. Overview
- **URL:** `/api/analytics/overview/`
- **Method:** `GET`
- **Returns:** Total study time, session count, completion rate, etc.

#### 2. Weekly Progress
- **URL:** `/api/analytics/weekly/`
- **Method:** `GET`
- **Returns:** Daily breakdown of study sessions for the past 7 days

#### 3. Topic Performance
- **URL:** `/api/analytics/topics/`
- **Method:** `GET`
- **Returns:** Study statistics grouped by topic

#### 4. Recommendations
- **URL:** `/api/analytics/recommendations/`
- **Method:** `GET`
- **Returns:** Personalized study recommendations

---

## AI Request Logs

### List/Create Logs
- **URL:** `/api/ailogs/`
- **Methods:** `GET`, `POST`

### Get/Update/Delete Log
- **URL:** `/api/ailogs/{id}/`
- **Methods:** `GET`, `PUT`, `PATCH`, `DELETE`

---

## Pagination

All list endpoints support pagination:
- **Page Size:** 20 items per page
- **Usage:** `?page=2`

---

## Interactive Documentation

Access interactive API documentation:
- **Swagger UI:** http://localhost:8000/swagger/
- **ReDoc:** http://localhost:8000/redoc/

---

## Error Responses

Standard error format:
```json
{
  "error": "Error message here",
  "detail": "More detailed information"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error
