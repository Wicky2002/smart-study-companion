from rest_framework import generics, permissions
from .serializers import UserCreateSerializer

class SignupView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserCreateSerializer
