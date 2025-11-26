from rest_framework import serializers
from django.contrib.auth.models import User
from .models import StudySession, StudyNote, AIRequestLog

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user


class StudySessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudySession
        fields = '__all__'
        read_only_fields = ('user', 'created_at')
    
    def validate_duration_minutes(self, value):
        """Ensure duration is positive and reasonable"""
        if value <= 0:
            raise serializers.ValidationError("Duration must be greater than 0 minutes.")
        if value > 1440:  # 24 hours
            raise serializers.ValidationError("Duration cannot exceed 1440 minutes (24 hours).")
        return value
    
    def validate_topic(self, value):
        """Ensure topic is not empty and properly formatted"""
        if not value or not value.strip():
            raise serializers.ValidationError("Topic cannot be empty.")
        return value.strip()
    
    def validate_difficulty(self, value):
        """Validate difficulty level"""
        if value:
            allowed_difficulties = ['easy', 'medium', 'hard', 'beginner', 'intermediate', 'advanced']
            if value.lower() not in allowed_difficulties:
                raise serializers.ValidationError(
                    f"Difficulty must be one of: {', '.join(allowed_difficulties)}"
                )
        return value.lower() if value else value


class StudyNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyNote
        fields = '__all__'
        read_only_fields = ('user', 'created_at')
    
    def validate_title(self, value):
        """Ensure title is not empty"""
        if not value or not value.strip():
            raise serializers.ValidationError("Title is required and cannot be empty.")
        if len(value) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long.")
        return value.strip()
    
    def validate_content(self, value):
        """Ensure content is not empty"""
        if not value or not value.strip():
            raise serializers.ValidationError("Content is required and cannot be empty.")
        if len(value) < 10:
            raise serializers.ValidationError("Content must be at least 10 characters long.")
        return value.strip()
    
    def validate_related_topic(self, value):
        """Clean and validate related topic"""
        if value:
            return value.strip()
        return value


class AIRequestLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIRequestLog
        fields = '__all__'
        read_only_fields = ('user', 'created_at')
    
    def validate_prompt(self, value):
        """Ensure prompt is not empty"""
        if not value or not value.strip():
            raise serializers.ValidationError("Prompt cannot be empty.")
        return value.strip()
