from django.urls import path
from . import views

urlpatterns = [
    path('overview/', views.get_overview, name='analytics_overview'),
    path('weekly/', views.get_weekly_progress, name='weekly_progress'),
    path('topics/', views.get_topic_performance, name='topic_performance'),
    path('recommendations/', views.get_recommendations, name='recommendations'),
]
