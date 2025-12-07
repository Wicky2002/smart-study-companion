from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from rest_framework import status
from study.models import AIRequestLog
from .ai_utils import (
    summarize_text,
    generate_study_plan_text,
    generate_flashcard_questions,
    generate_study_advice,
    extract_key_points,
    answer_question,
    analyze_study_sentiment,
    extract_keywords,
    generate_quiz_questions
)
import os
import logging

logger = logging.getLogger(__name__)

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
    
    try:
        # Generate AI-powered study plan
        prompt = f"Create a {duration_days}-day study plan for {topic} at {difficulty} level"
        
        # Generate plan text using AI
        ai_generated_text = generate_study_plan_text(topic, duration_days, difficulty)
        
        # Parse and structure the response
        daily_tasks = []
        lines = ai_generated_text.split('\n')
        
        for i in range(min(duration_days, 7)):
            daily_tasks.append({
                'day': i + 1,
                'task': f'Day {i + 1}: {lines[0] if lines else f"Focus on {topic} fundamentals"}',
                'duration_minutes': 60,
                'resources': ['Online tutorials', 'Practice exercises', 'Reading materials']
            })
        
        ai_response = {
            'study_plan': {
                'topic': topic,
                'duration': duration_days,
                'difficulty': difficulty,
                'daily_tasks': daily_tasks,
                'ai_generated_overview': ai_generated_text[:500],
                'tips': [
                    'Take regular 5-10 minute breaks every hour',
                    'Practice active recall while studying',
                    'Review previous day\'s content before starting new material',
                    'Use spaced repetition for better retention'
                ]
            }
        }
        
        # Log the AI request
        AIRequestLog.objects.create(
            user=request.user,
            prompt=prompt,
            response=str(ai_response)[:1000]
        )
        
        return Response(ai_response, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Study plan generation error: {e}")
        return Response(
            {'error': 'Failed to generate study plan', 'details': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([AIRequestThrottle])
def generate_summary(request):
    """
    Generate a summary of study notes or content using AI.
    Expected input: { "content": "..." } or { "text": "..." }
    """
    # Handle both 'content' and 'text' field names
    content = request.data.get('content') or request.data.get('text', '')
    
    if not content:
        return Response(
            {'error': 'Content or text is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Handle if content is a dict
    if isinstance(content, dict):
        content = str(content)
    
    if len(str(content).strip()) < 100:
        return Response(
            {'error': 'Content too short. Please provide at least 100 characters for meaningful summarization.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        prompt = f"Summarize the following content: {str(content)[:200]}..."
        
        # Use AI to generate summary
        summary_text = summarize_text(str(content), max_length=150, min_length=50)
        key_points = extract_key_points(str(content), num_points=3)
        
        ai_response = {
            'summary': summary_text,
            'key_points': key_points,
            'word_count': len(str(content).split()),
            'summary_word_count': len(summary_text.split()),
            'compression_ratio': f"{(len(summary_text) / len(str(content)) * 100):.1f}%"
        }
        
        # Log the AI request
        AIRequestLog.objects.create(
            user=request.user,
            prompt=prompt,
            response=str(ai_response)[:1000]
        )
        
        return Response(ai_response, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Summarization error: {e}")
        return Response(
            {'error': 'Failed to generate summary', 'details': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([AIRequestThrottle])
def generate_flashcards(request):
    """
    Generate flashcards from study content using AI.
    Expected input: { "content": "...", "num_cards": 5 } or { "text": "...", "count": 5 }
    """
    # Handle both 'content'/'text' and 'num_cards'/'count'
    content = request.data.get('content') or request.data.get('text', '')
    num_cards = request.data.get('num_cards') or request.data.get('count', 5)
    
    if not content:
        return Response(
            {'error': 'Content or text is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Handle if content is a dict
    if isinstance(content, dict):
        content = str(content)
    
    if not content:
        return Response(
            {'error': 'Content is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        num_cards = int(num_cards)
    except (ValueError, TypeError):
        num_cards = 5
    
    if num_cards < 1 or num_cards > 20:
        return Response(
            {'error': 'Number of cards must be between 1 and 20'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        prompt = f"Generate {num_cards} flashcards from: {str(content)[:200]}..."
        
        # Use AI to generate flashcards
        flashcards = generate_flashcard_questions(str(content), num_cards)
        
        # If AI generation fails or produces too few cards, add default ones
        while len(flashcards) < num_cards:
            flashcards.append({
                'id': len(flashcards) + 1,
                'question': f'What are the main concepts discussed in the content?',
                'answer': str(content)[:100] + '...',
                'full_context': str(content)[:200]
            })
        
        ai_response = {
            'flashcards': flashcards[:num_cards],
            'total_generated': len(flashcards),
            'source_length': len(str(content).split())
        }
        
        # Log the AI request
        AIRequestLog.objects.create(
            user=request.user,
            prompt=prompt,
            response=str(ai_response)[:1000]
        )
        
        return Response(ai_response, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Flashcard generation error: {e}")
        return Response(
            {'error': 'Failed to generate flashcards', 'details': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([AIRequestThrottle])
def get_study_advice(request):
    """
    Get personalized study advice based on user's study history using AI.
    Expected input: { "current_topic": "...", "struggles": "..." }
    """
    current_topic = request.data.get('current_topic', '')
    struggles = request.data.get('struggles', '')
    
    try:
        prompt = f"Provide study advice for {current_topic}. Student struggles with: {struggles}"
        
        # Use AI to generate personalized advice
        ai_advice = generate_study_advice(current_topic, struggles)
        
        # Structure the response
        advice_lines = [line.strip() for line in ai_advice.split('.') if len(line.strip()) > 10]
        
        ai_response = {
            'advice': advice_lines[:3] if len(advice_lines) >= 3 else [
                f'For {current_topic}, focus on understanding fundamentals first',
                'Break down complex topics into smaller, manageable chunks',
                'Practice regularly with varied examples and exercises'
            ],
            'recommended_resources': [
                'Online interactive courses and tutorials',
                'Practice problems with step-by-step solutions',
                'Study groups or peer learning communities',
                'Educational videos with visual explanations'
            ],
            'study_techniques': [
                'Active recall: Test yourself frequently without looking at notes',
                'Spaced repetition: Review material at increasing intervals',
                'Feynman technique: Explain concepts in simple terms',
                'Pomodoro technique: Study in focused 25-minute sessions'
            ],
            'personalized_tip': ai_advice[:200] if ai_advice else f'Focus on mastering {current_topic} fundamentals before moving to advanced concepts.'
        }
        
        # Log the AI request
        AIRequestLog.objects.create(
            user=request.user,
            prompt=prompt,
            response=str(ai_response)[:1000]
        )
        
        return Response(ai_response, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Study advice generation error: {e}")
        return Response(
            {'error': 'Failed to generate study advice', 'details': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([AIRequestThrottle])
def answer_study_question(request):
    """
    Answer a question based on study context using AI.
    Expected input: { "question": "...", "context": "..." }
    """
    question = request.data.get('question', '')
    context = request.data.get('context') or request.data.get('content', '')
    
    if not question or not context:
        return Response(
            {'error': 'Both question and context are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Handle if context is a dict
    if isinstance(context, dict):
        context = str(context)
    
    try:
        prompt = f"Question: {question}. Context: {str(context)[:200]}..."
        
        # Use AI to answer question
        result = answer_question(question, str(context))
        
        ai_response = {
            'question': question,
            'answer': result['answer'],
            'confidence': result['confidence'],
            'context_used': str(context)[result.get('start', 0):result.get('end', 100)]
        }
        
        # Log the AI request
        AIRequestLog.objects.create(
            user=request.user,
            prompt=prompt,
            response=str(ai_response)[:1000]
        )
        
        return Response(ai_response, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Question answering error: {e}")
        return Response(
            {'error': 'Failed to answer question', 'details': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([AIRequestThrottle])
def analyze_sentiment(request):
    """
    Analyze sentiment of study notes or reflections.
    Expected input: { "text": "..." } or { "content": "..." }
    """
    text = request.data.get('text') or request.data.get('content', '')
    
    if not text:
        return Response(
            {'error': 'Text or content is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Handle if text is a dict
    if isinstance(text, dict):
        text = str(text)
    
    try:
        prompt = f"Analyze sentiment of: {str(text)[:100]}..."
        
        # Use AI to analyze sentiment
        result = analyze_study_sentiment(str(text))
        
        # Provide interpretation
        interpretation = {
            'positive': 'Your study notes show positive engagement and enthusiasm!',
            'negative': 'Your notes suggest some frustration. Consider taking breaks or trying different study methods.',
            'neutral': 'Your notes are objective and factual.'
        }
        
        ai_response = {
            'sentiment': result['sentiment'],
            'confidence': result['confidence'],
            'label': result['label'],
            'interpretation': interpretation.get(result['sentiment'], 'Unable to determine sentiment.'),
            'text_length': len(str(text).split())
        }
        
        # Log the AI request
        AIRequestLog.objects.create(
            user=request.user,
            prompt=prompt,
            response=str(ai_response)[:1000]
        )
        
        return Response(ai_response, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Sentiment analysis error: {e}")
        return Response(
            {'error': 'Failed to analyze sentiment', 'details': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([AIRequestThrottle])
def extract_study_keywords(request):
    """
    Extract important keywords from study content.
    Expected input: { "text": "...", "num_keywords": 10 }
    """
    text = request.data.get('text') or request.data.get('content', '')
    num_keywords = request.data.get('num_keywords', 10)
    
    if not text:
        return Response(
            {'error': 'Text or content is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Handle if text is a dict
    if isinstance(text, dict):
        text = str(text)
    
    try:
        num_keywords = int(num_keywords)
    except (ValueError, TypeError):
        num_keywords = 10
    
    try:
        prompt = f"Extract keywords from: {str(text)[:100]}..."
        
        # Extract keywords
        keywords = extract_keywords(str(text), num_keywords)
        
        ai_response = {
            'keywords': keywords,
            'total_keywords': len(keywords),
            'text_length': len(str(text).split())
        }
        
        # Log the AI request
        AIRequestLog.objects.create(
            user=request.user,
            prompt=prompt,
            response=str(ai_response)[:1000]
        )
        
        return Response(ai_response, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Keyword extraction error: {e}")
        return Response(
            {'error': 'Failed to extract keywords', 'details': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([AIRequestThrottle])
def generate_quiz(request):
    """
    Generate quiz questions from study content.
    Expected input: { "content": "...", "num_questions": 5 }
    """
    content = request.data.get('content') or request.data.get('text', '')
    num_questions = request.data.get('num_questions') or request.data.get('count', 5)
    
    if not content:
        return Response(
            {'error': 'Content or text is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Handle if content is a dict
    if isinstance(content, dict):
        content = str(content)
    
    try:
        num_questions = int(num_questions)
    except (ValueError, TypeError):
        num_questions = 5
    
    try:
        prompt = f"Generate {num_questions} quiz questions from: {str(content)[:200]}..."
        
        # Generate quiz questions
        questions = generate_quiz_questions(str(content), num_questions)
        
        ai_response = {
            'quiz': questions,
            'total_questions': len(questions),
            'source_length': len(str(content).split())
        }
        
        # Log the AI request
        AIRequestLog.objects.create(
            user=request.user,
            prompt=prompt,
            response=str(ai_response)[:1000]
        )
        
        return Response(ai_response, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Quiz generation error: {e}")
        return Response(
            {'error': 'Failed to generate quiz', 'details': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

