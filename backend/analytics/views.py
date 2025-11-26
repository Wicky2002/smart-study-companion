from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from study.models import StudySession, StudyNote
from django.db.models import Sum, Count, Avg, Q
from datetime import datetime, timedelta
from django.utils import timezone


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_overview(request):
    """
    Get overall study analytics for the authenticated user.
    Returns total study time, session count, and other metrics.
    """
    user = request.user
    
    # Get all sessions for the user
    sessions = StudySession.objects.filter(user=user)
    
    # Calculate total study time
    total_minutes = sessions.aggregate(total=Sum('duration_minutes'))['total'] or 0
    
    # Count sessions
    session_count = sessions.count()
    completed_count = sessions.filter(completed=True).count()
    
    # Get unique topics
    topics = sessions.values_list('topic', flat=True).distinct()
    
    # Get notes count
    notes_count = StudyNote.objects.filter(user=user).count()
    
    # Calculate average session duration
    avg_duration = sessions.aggregate(avg=Avg('duration_minutes'))['avg'] or 0
    
    analytics = {
        'total_study_minutes': total_minutes,
        'total_study_hours': round(total_minutes / 60, 2),
        'session_count': session_count,
        'completed_sessions': completed_count,
        'completion_rate': round((completed_count / session_count * 100) if session_count > 0 else 0, 2),
        'unique_topics': len(topics),
        'notes_count': notes_count,
        'average_session_duration': round(avg_duration, 2)
    }
    
    return Response(analytics, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_weekly_progress(request):
    """
    Get study progress for the past 7 days.
    Returns daily breakdown of study sessions and time.
    """
    user = request.user
    
    # Calculate date range for the past 7 days
    end_date = timezone.now()
    start_date = end_date - timedelta(days=7)
    
    # Get sessions in the date range
    sessions = StudySession.objects.filter(
        user=user,
        created_at__gte=start_date,
        created_at__lte=end_date
    )
    
    # Group by day
    daily_data = []
    for i in range(7):
        day = start_date + timedelta(days=i)
        day_sessions = sessions.filter(
            created_at__date=day.date()
        )
        
        total_minutes = day_sessions.aggregate(total=Sum('duration_minutes'))['total'] or 0
        
        daily_data.append({
            'date': day.strftime('%Y-%m-%d'),
            'day_name': day.strftime('%A'),
            'session_count': day_sessions.count(),
            'total_minutes': total_minutes,
            'completed': day_sessions.filter(completed=True).count()
        })
    
    weekly_stats = {
        'period': {
            'start': start_date.strftime('%Y-%m-%d'),
            'end': end_date.strftime('%Y-%m-%d')
        },
        'daily_breakdown': daily_data,
        'weekly_total_minutes': sum(day['total_minutes'] for day in daily_data),
        'weekly_session_count': sum(day['session_count'] for day in daily_data)
    }
    
    return Response(weekly_stats, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_topic_performance(request):
    """
    Get performance analytics grouped by topic.
    Shows which topics user has studied most.
    """
    user = request.user
    
    # Get all sessions grouped by topic
    sessions = StudySession.objects.filter(user=user)
    
    # Aggregate by topic
    topic_stats = sessions.values('topic').annotate(
        session_count=Count('id'),
        total_minutes=Sum('duration_minutes'),
        completed_count=Count('id', filter=Q(completed=True)),
        avg_duration=Avg('duration_minutes')
    ).order_by('-total_minutes')
    
    # Format the response
    topic_data = []
    for stat in topic_stats:
        topic_data.append({
            'topic': stat['topic'],
            'session_count': stat['session_count'],
            'total_minutes': stat['total_minutes'],
            'total_hours': round(stat['total_minutes'] / 60, 2),
            'completed_sessions': stat['completed_count'],
            'completion_rate': round((stat['completed_count'] / stat['session_count'] * 100) if stat['session_count'] > 0 else 0, 2),
            'average_duration': round(stat['avg_duration'], 2)
        })
    
    response = {
        'topics': topic_data,
        'total_topics': len(topic_data)
    }
    
    return Response(response, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recommendations(request):
    """
    Provide study recommendations based on user's analytics.
    """
    user = request.user
    
    # Get recent sessions
    recent_sessions = StudySession.objects.filter(user=user).order_by('-created_at')[:10]
    
    total_minutes = recent_sessions.aggregate(total=Sum('duration_minutes'))['total'] or 0
    avg_duration = total_minutes / len(recent_sessions) if recent_sessions else 0
    
    recommendations = []
    
    # Recommendation based on study duration
    if avg_duration < 30:
        recommendations.append({
            'type': 'duration',
            'message': 'Consider increasing your study session length to at least 30 minutes for better focus.',
            'priority': 'high'
        })
    
    # Recommendation based on consistency
    if recent_sessions.count() < 5:
        recommendations.append({
            'type': 'consistency',
            'message': 'Try to study more regularly. Consistency is key to effective learning.',
            'priority': 'medium'
        })
    
    # Recommendation based on completion rate
    completed = recent_sessions.filter(completed=True).count()
    completion_rate = (completed / recent_sessions.count() * 100) if recent_sessions.count() > 0 else 0
    
    if completion_rate < 70:
        recommendations.append({
            'type': 'completion',
            'message': 'Focus on completing your study sessions. Break large topics into smaller, manageable chunks.',
            'priority': 'high'
        })
    
    # General recommendations
    recommendations.append({
        'type': 'technique',
        'message': 'Try the Pomodoro Technique: 25 minutes of focused study followed by a 5-minute break.',
        'priority': 'low'
    })
    
    recommendations.append({
        'type': 'review',
        'message': 'Review your notes regularly. Spaced repetition helps with long-term retention.',
        'priority': 'medium'
    })
    
    return Response({'recommendations': recommendations}, status=status.HTTP_200_OK)
