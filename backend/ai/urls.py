from django.urls import path
from . import views

urlpatterns = [
    path('generate/study-plan/', views.generate_study_plan, name='generate_study_plan'),
    path('generate/summary/', views.generate_summary, name='generate_summary'),
    path('generate/flashcards/', views.generate_flashcards, name='generate_flashcards'),
    path('generate/advice/', views.get_study_advice, name='get_study_advice'),
    path('answer-question/', views.answer_study_question, name='answer_study_question'),
    path('analyze-sentiment/', views.analyze_sentiment, name='analyze_sentiment'),
    path('extract-keywords/', views.extract_study_keywords, name='extract_study_keywords'),
    path('generate/quiz/', views.generate_quiz, name='generate_quiz'),
]
