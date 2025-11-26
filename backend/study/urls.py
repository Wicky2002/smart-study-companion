from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudySessionViewSet, StudyNoteViewSet, AIRequestLogViewSet
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def hello(request):
    """Test endpoint to verify API is working"""
    return Response({'message': 'Hello from Smart Study Companion API!'})


# Create router and register viewsets
router = DefaultRouter()
router.register(r'sessions', StudySessionViewSet, basename='session')
router.register(r'notes', StudyNoteViewSet, basename='note')
router.register(r'ailogs', AIRequestLogViewSet, basename='ailog')

urlpatterns = [
    path('hello/', hello, name='hello'),
    path('', include(router.urls)),
]
