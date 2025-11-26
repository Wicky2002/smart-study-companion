from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from rest_framework import status
from study.models import AIRequestLog
import os

# Custom throttle class for AI endpoints
class AIRequestThrottle(UserRateThrottle):
    rate = '10/minute'


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([AIRequestThrottle])
def generate_study_plan(request):
    """
    Generate a personalized study plan based on user input.
    Expected input: { "topic": "...", "duration_days": 7, "difficulty": "..." }
    """
    topic = request.data.get('topic', '')
    duration_days = request.data.get('duration_days', 7)
    difficulty = request.data.get('difficulty', 'intermediate')
    
    if not topic:
        return Response(
            {'error': 'Topic is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Simulated AI response (replace with actual OpenAI/LLM integration)
    prompt = f"Create a {duration_days}-day study plan for {topic} at {difficulty} level"
    
    ai_response = {
        'study_plan': {
            'topic': topic,
            'duration': duration_days,
            'difficulty': difficulty,
            'daily_tasks': [
                {
                    'day': i + 1,
                    'task': f'Day {i + 1}: Study core concepts of {topic}',
                    'duration_minutes': 60,
                    'resources': ['Textbook chapter', 'Online videos']
                }
                for i in range(duration_days)
            ],
            'tips': [
                'Take regular breaks',
                'Practice with exercises',
                'Review previous days content'
            ]
        }
    }
    
    # Log the AI request
    AIRequestLog.objects.create(
        user=request.user,
        prompt=prompt,
        response=str(ai_response)
    )
    
    return Response(ai_response, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([AIRequestThrottle])
def generate_summary(request):
    """
    Generate a summary of study notes or content.
    Expected input: { "content": "..." }
    """
    content = request.data.get('content', '')
    
    if not content:
        return Response(
            {'error': 'Content is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Simulated AI response
    prompt = f"Summarize the following content: {content[:200]}..."
    
    ai_response = {
        'summary': f"Summary of the provided content about {content[:50]}...",
        'key_points': [
            'Key concept 1',
            'Key concept 2',
            'Key concept 3'
        ],
        'word_count': len(content.split())
    }
    
    # Log the AI request
    AIRequestLog.objects.create(
        user=request.user,
        prompt=prompt,
        response=str(ai_response)
    )
    
    return Response(ai_response, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([AIRequestThrottle])
def generate_flashcards(request):
    """
    Generate flashcards from study content.
    Expected input: { "content": "...", "num_cards": 5 }
    """
    content = request.data.get('content', '')
    num_cards = request.data.get('num_cards', 5)
    
    if not content:
        return Response(
            {'error': 'Content is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Simulated AI response
    prompt = f"Generate {num_cards} flashcards from: {content[:200]}..."
    
    ai_response = {
        'flashcards': [
            {
                'id': i + 1,
                'question': f'Question {i + 1} about the topic',
                'answer': f'Answer to question {i + 1}'
            }
            for i in range(num_cards)
        ]
    }
    
    # Log the AI request
    AIRequestLog.objects.create(
        user=request.user,
        prompt=prompt,
        response=str(ai_response)
    )
    
    return Response(ai_response, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([AIRequestThrottle])
def get_study_advice(request):
    """
    Get personalized study advice based on user's study history.
    Expected input: { "current_topic": "...", "struggles": "..." }
    """
    current_topic = request.data.get('current_topic', '')
    struggles = request.data.get('struggles', '')
    
    # Simulated AI response
    prompt = f"Provide study advice for {current_topic}. Student struggles with: {struggles}"
    
    ai_response = {
        'advice': [
            f'For {current_topic}, focus on understanding fundamentals first',
            'Break down complex topics into smaller chunks',
            'Practice regularly with varied examples'
        ],
        'recommended_resources': [
            'Online courses',
            'Practice problems',
            'Study groups'
        ],
        'study_techniques': [
            'Active recall',
            'Spaced repetition',
            'Feynman technique'
        ]
    }
    
    # Log the AI request
    AIRequestLog.objects.create(
        user=request.user,
        prompt=prompt,
        response=str(ai_response)
    )
    
    return Response(ai_response, status=status.HTTP_200_OK)
