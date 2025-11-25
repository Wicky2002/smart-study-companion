from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudySessionViewSet, StudyNoteViewSet, AIRequestLogViewSet

router = DefaultRouter()
router.register(r'sessions', StudySessionViewSet, basename='session')
router.register(r'notes', StudyNoteViewSet, basename='note')
router.register(r'logs', AIRequestLogViewSet, basename='log')

urlpatterns = [
    path('', include(router.urls)),
]
