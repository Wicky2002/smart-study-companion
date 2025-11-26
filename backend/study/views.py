from rest_framework import viewsets, permissions, filters
from .models import StudySession, StudyNote, AIRequestLog
from .serializers import StudySessionSerializer, StudyNoteSerializer, AIRequestLogSerializer
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, CharFilter, BooleanFilter, NumberFilter
from django.db.models import Q


class StudySessionFilter(FilterSet):
    """Custom filter for StudySession"""
    topic = CharFilter(field_name='topic', lookup_expr='icontains')
    difficulty = CharFilter(field_name='difficulty', lookup_expr='iexact')
    completed = BooleanFilter(field_name='completed')
    min_duration = NumberFilter(field_name='duration_minutes', lookup_expr='gte')
    max_duration = NumberFilter(field_name='duration_minutes', lookup_expr='lte')
    date = CharFilter(method='filter_by_date')
    
    def filter_by_date(self, queryset, name, value):
        """Filter by specific date (YYYY-MM-DD format)"""
        try:
            return queryset.filter(created_at__date=value)
        except:
            return queryset
    
    class Meta:
        model = StudySession
        fields = ['topic', 'difficulty', 'completed', 'min_duration', 'max_duration', 'date']


class StudyNoteFilter(FilterSet):
    """Custom filter for StudyNote"""
    title = CharFilter(field_name='title', lookup_expr='icontains')
    related_topic = CharFilter(field_name='related_topic', lookup_expr='icontains')
    search = CharFilter(method='filter_search')
    
    def filter_search(self, queryset, name, value):
        """Search across title, content, and related_topic"""
        return queryset.filter(
            Q(title__icontains=value) | 
            Q(content__icontains=value) | 
            Q(related_topic__icontains=value)
        )
    
    class Meta:
        model = StudyNote
        fields = ['title', 'related_topic', 'search']

class StudySessionViewSet(viewsets.ModelViewSet):
    serializer_class = StudySessionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = StudySessionFilter
    ordering_fields = ['created_at', 'duration_minutes', 'topic']
    ordering = ['-created_at']

    def get_queryset(self):
        return StudySession.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class StudyNoteViewSet(viewsets.ModelViewSet):
    serializer_class = StudyNoteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = StudyNoteFilter
    search_fields = ['title', 'content', 'related_topic']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']

    def get_queryset(self):
        return StudyNote.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AIRequestLogViewSet(viewsets.ModelViewSet):
    serializer_class = AIRequestLogSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return AIRequestLog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
