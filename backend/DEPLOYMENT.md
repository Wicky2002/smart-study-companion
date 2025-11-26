# Smart Study Companion Backend - Setup & Deployment Guide

## Prerequisites
- Python 3.8+
- pip
- Virtual environment

## Installation

### 1. Clone the repository
```bash
cd backend
```

### 2. Create virtual environment
```bash
python -m venv venv
```

### 3. Activate virtual environment
**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

### 4. Install dependencies
```bash
pip install -r requirements.txt
```

### 5. Environment Variables
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 6. Run migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 7. Create superuser (admin)
```bash
python manage.py createsuperuser
```

### 8. Run development server
```bash
python manage.py runserver
```

The API will be available at: `http://localhost:8000/`

## API Endpoints

- **Admin Panel:** http://localhost:8000/admin/
- **API Root:** http://localhost:8000/api/
- **Swagger Docs:** http://localhost:8000/swagger/
- **ReDoc:** http://localhost:8000/redoc/

## Testing

### Test the API
1. Sign up: `POST /api/auth/signup/`
2. Login: `POST /api/auth/login/`
3. Use the access token to make authenticated requests

### Quick Test Endpoint
```bash
curl http://localhost:8000/api/hello/
```

## Project Structure

```
backend/
├── core/                 # Main project settings
├── accounts/             # User authentication
├── study/               # Study sessions, notes, AI logs
├── ai/                  # AI assistant features
├── analytics/           # Study analytics & recommendations
├── requirements.txt     # Python dependencies
├── .env.example        # Environment variables template
└── manage.py           # Django management script
```

## Installed Apps & Features

✅ **Django & DRF** - Core framework
✅ **JWT Authentication** - Secure token-based auth
✅ **CORS Headers** - Cross-origin support
✅ **Django Filters** - Advanced filtering
✅ **Swagger/ReDoc** - API documentation
✅ **Pagination** - 20 items per page
✅ **Throttling** - Rate limiting (10/min for AI)

## Available Models

1. **User** - Django default user model
2. **StudySession** - Track study sessions
3. **StudyNote** - Store study notes
4. **AIRequestLog** - Log AI interactions

## Production Deployment

### 1. Update settings for production
```python
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com']
SECRET_KEY = 'generate-strong-random-key'
```

### 2. Install production dependencies
```bash
pip install gunicorn psycopg2-binary whitenoise
```

### 3. Collect static files
```bash
python manage.py collectstatic
```

### 4. Run with Gunicorn
```bash
gunicorn core.wsgi:application --bind 0.0.0.0:8000
```

## Database Migration (PostgreSQL)

To use PostgreSQL instead of SQLite:

1. Install psycopg2:
```bash
pip install psycopg2-binary
```

2. Update `settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'studycompanion',
        'USER': 'your_db_user',
        'PASSWORD': 'your_db_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

3. Run migrations:
```bash
python manage.py migrate
```

## Troubleshooting

### Port already in use
```bash
python manage.py runserver 8001
```

### Migration issues
```bash
python manage.py makemigrations
python manage.py migrate --run-syncdb
```

### Clear database (SQLite)
```bash
del db.sqlite3
python manage.py migrate
```

## Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [JWT Authentication](https://django-rest-framework-simplejwt.readthedocs.io/)

## Support

For issues or questions, check:
- API Documentation: `/swagger/` or `/redoc/`
- Django Admin: `/admin/`
- Logs: Check console output for errors
