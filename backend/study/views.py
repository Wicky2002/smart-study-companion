from rest_framework import viewsets, permissions
from .models import StudySession, StudyNote, AIRequestLog
from .serializers import StudySessionSerializer, StudyNoteSerializer, AIRequestLogSerializer
from rest_framework.permissions import IsAuthenticated

class StudySessionViewSet(viewsets.ModelViewSet):
    serializer_class = StudySessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return StudySession.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class StudyNoteViewSet(viewsets.ModelViewSet):
    serializer_class = StudyNoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return StudyNote.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AIRequestLogViewSet(viewsets.ModelViewSet):
    serializer_class = AIRequestLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AIRequestLog.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
