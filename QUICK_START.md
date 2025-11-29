# 🚀 Quick Start Guide

## Start the Application

### Terminal 1 - Backend (Django)
```powershell
cd backend
python manage.py runserver
```
✅ Backend running on: **http://localhost:8000**

### Terminal 2 - Frontend (React)
```powershell
cd frontend
npm run dev
```
✅ Frontend running on: **http://localhost:5173**

### Open Browser
Navigate to: **http://localhost:5173**

---

## First Time Setup

### Backend (One-time)
```powershell
cd backend
pip install -r requirements.txt
python manage.py migrate
```

### Frontend (One-time)
```powershell
cd frontend
npm install
```

---

## Create Admin User (Optional)
```powershell
cd backend
python manage.py createsuperuser
```
Access admin panel: **http://localhost:8000/admin/**

---

## View API Documentation
**Swagger UI**: http://localhost:8000/swagger/
**ReDoc**: http://localhost:8000/redoc/

---

## Test the Application

1. **Sign Up**: Create a new account
2. **Dashboard**: View your study statistics
3. **New Session**: Create a study session
4. **Sessions**: View and manage sessions
5. **Notes**: Create and edit notes
6. **AI Assistant**: Try summary, study plan, flashcards, advice
7. **Progress**: View analytics and recommendations
8. **Logout**: Test logout and login again

---

## Troubleshooting

### Backend Port Already in Use
```powershell
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Frontend Port Already in Use
```powershell
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Clear Browser Cache
- Open DevTools (F12)
- Right-click refresh button
- Select "Empty Cache and Hard Reload"

---

## 📁 Important Files

- `INTEGRATION_GUIDE.md` - Complete integration documentation
- `INTEGRATION_SUMMARY.md` - Feature summary and architecture
- `BACKEND_FEATURES_IMPLEMENTED.md` - Backend API documentation
- `API_DOCUMENTATION.md` - API endpoints reference

---

## 🎯 Quick Check

✅ Backend running on port 8000?
✅ Frontend running on port 5173?
✅ Can access http://localhost:5173?
✅ Can sign up and login?
✅ Dashboard shows data?

**If all yes → You're ready to go! 🎉**
