"""
AI utility functions using Hugging Face transformers.
These models run locally without requiring API keys.
"""
from transformers import pipeline
import logging
import re
from collections import Counter

logger = logging.getLogger(__name__)

# Cache for loaded models
_summarization_model = None
_text_generation_model = None
_question_answering_model = None
_sentiment_model = None


def get_summarization_model():
    """Get or initialize the summarization model."""
    global _summarization_model
    if _summarization_model is None:
        try:
            logger.info("Loading summarization model...")
            # Using a smaller, efficient model for summarization
            _summarization_model = pipeline(
                "summarization",
                model="facebook/bart-large-cnn",
                device=-1  # Use CPU
            )
            logger.info("Summarization model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load summarization model: {e}")
            _summarization_model = None
    return _summarization_model


def get_text_generation_model():
    """Get or initialize the text generation model."""
    global _text_generation_model
    if _text_generation_model is None:
        try:
            logger.info("Loading text generation model...")
            # Using a smaller model for generation
            _text_generation_model = pipeline(
                "text-generation",
                model="gpt2",
                device=-1  # Use CPU
            )
            logger.info("Text generation model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load text generation model: {e}")
            _text_generation_model = None
    return _text_generation_model


def get_question_answering_model():
    """Get or initialize the question answering model."""
    global _question_answering_model
    if _question_answering_model is None:
        try:
            logger.info("Loading question answering model...")
            _question_answering_model = pipeline(
                "question-answering",
                model="distilbert-base-cased-distilled-squad",
                device=-1
            )
            logger.info("Question answering model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load question answering model: {e}")
            _question_answering_model = None
    return _question_answering_model


def get_sentiment_model():
    """Get or initialize the sentiment analysis model."""
    global _sentiment_model
    if _sentiment_model is None:
        try:
            logger.info("Loading sentiment analysis model...")
            _sentiment_model = pipeline(
                "sentiment-analysis",
                model="distilbert-base-uncased-finetuned-sst-2-english",
                device=-1
            )
            logger.info("Sentiment model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load sentiment model: {e}")
            _sentiment_model = None
    return _sentiment_model


def summarize_text(content, max_length=150, min_length=50):
    """
    Summarize the given content using AI.
    
    Args:
        content (str): Text to summarize
        max_length (int): Maximum length of summary
        min_length (int): Minimum length of summary
    
    Returns:
        str: Summarized text or error message
    """
    try:
        model = get_summarization_model()
        if model is None:
            return "AI model not available. Please try again later."
        
        # Ensure content is not too short
        if len(content.split()) < 50:
            return content  # Return original if too short
        
        # Truncate if too long (BART has max input length)
        max_input_length = 1024
        words = content.split()
        if len(words) > max_input_length:
            content = ' '.join(words[:max_input_length])
        
        # Generate summary
        summary = model(
            content,
            max_length=max_length,
            min_length=min_length,
            do_sample=False
        )
        
        return summary[0]['summary_text']
    
    except Exception as e:
        logger.error(f"Summarization error: {e}")
        return f"Error generating summary: {str(e)}"


def generate_study_plan_text(topic, duration_days, difficulty):
    """
    Generate study plan suggestions using structured templates.
    
    Args:
        topic (str): Study topic
        duration_days (int): Number of days for the plan
        difficulty (str): Difficulty level
    
    Returns:
        str: Generated study plan text
    """
    try:
        # Structured study plan templates by difficulty
        beginner_activities = [
            f"Introduction to fundamental concepts of {topic}",
            f"Understanding basic terminology and principles in {topic}",
            f"Exploring simple examples and use cases of {topic}",
            f"Practice basic exercises and problems in {topic}",
            f"Review foundational concepts and take notes",
            f"Watch introductory tutorials about {topic}",
            f"Complete beginner-level practice problems"
        ]
        
        intermediate_activities = [
            f"Deep dive into core concepts of {topic}",
            f"Study advanced techniques and methodologies in {topic}",
            f"Work on intermediate-level problems and case studies",
            f"Analyze real-world applications of {topic}",
            f"Practice solving complex problems in {topic}",
            f"Review and reinforce previous day's learning",
            f"Complete challenging exercises and review solutions"
        ]
        
        advanced_activities = [
            f"Master advanced concepts and theories in {topic}",
            f"Explore cutting-edge research and applications of {topic}",
            f"Solve expert-level problems and optimize solutions",
            f"Study complex algorithms and implementations in {topic}",
            f"Work on advanced projects applying {topic}",
            f"Analyze edge cases and advanced scenarios",
            f"Synthesize knowledge and prepare comprehensive review"
        ]
        
        # Select activities based on difficulty
        if difficulty.lower() == 'beginner':
            activities = beginner_activities
        elif difficulty.lower() == 'advanced':
            activities = advanced_activities
        else:
            activities = intermediate_activities
        
        # Generate plan overview
        plan_text = f"This {duration_days}-day study plan will guide you through learning {topic} at {difficulty} level. "
        plan_text += f"Each day focuses on building upon previous knowledge with structured learning activities.\n\n"
        
        # Add daily activities
        for day in range(duration_days):
            activity_index = day % len(activities)
            plan_text += f"Day {day + 1}: {activities[activity_index]}\n"
        
        return plan_text
    
    except Exception as e:
        logger.error(f"Study plan generation error: {e}")
        return f"Error generating study plan: {str(e)}"


def generate_flashcard_questions(content, num_cards=5):
    """
    Generate flashcard questions from content.
    
    Args:
        content (str): Source content
        num_cards (int): Number of flashcards to generate
    
    Returns:
        list: List of question-answer pairs
    """
    try:
        # For flashcards, we'll use a simpler extraction approach
        # Split content into sentences
        sentences = [s.strip() for s in content.split('.') if len(s.strip()) > 20]
        
        flashcards = []
        for i, sentence in enumerate(sentences[:num_cards]):
            # Create questions from sentences
            words = sentence.split()
            if len(words) > 5:
                # Simple question generation: blank out key words
                key_word_index = len(words) // 2
                key_word = words[key_word_index]
                
                question_words = words.copy()
                question_words[key_word_index] = "______"
                
                flashcards.append({
                    'id': i + 1,
                    'question': ' '.join(question_words) + '?',
                    'answer': key_word,
                    'full_context': sentence
                })
        
        return flashcards
    
    except Exception as e:
        logger.error(f"Flashcard generation error: {e}")
        return []


def generate_study_advice(topic, struggles):
    """
    Generate study advice using knowledge-based templates.
    
    Args:
        topic (str): Current study topic
        struggles (str): Student's struggles
    
    Returns:
        str: Generated advice
    """
    try:
        # Build contextual advice based on common study challenges
        advice = f"Here's personalized advice for studying {topic}:\n\n"
        
        struggles_lower = struggles.lower()
        
        # Provide specific advice based on mentioned struggles
        if any(word in struggles_lower for word in ['understand', 'confus', 'difficult', 'hard']):
            advice += "1. Break down complex concepts into smaller, manageable parts. Start with the fundamentals and gradually build up.\n"
            advice += "2. Use analogies and real-world examples to relate new concepts to things you already know.\n"
            advice += "3. Create visual diagrams or mind maps to visualize relationships between concepts.\n\n"
        
        if any(word in struggles_lower for word in ['remember', 'forget', 'recall', 'memorize']):
            advice += "1. Use active recall by testing yourself regularly instead of passive reading.\n"
            advice += "2. Implement spaced repetition - review material at increasing intervals (1 day, 3 days, 1 week, etc.).\n"
            advice += "3. Create mnemonic devices or acronyms to help remember key information.\n\n"
        
        if any(word in struggles_lower for word in ['time', 'manage', 'procrastinat', 'focus']):
            advice += "1. Use the Pomodoro Technique: 25 minutes of focused study followed by 5-minute breaks.\n"
            advice += "2. Set specific, achievable goals for each study session.\n"
            advice += "3. Eliminate distractions by turning off notifications and finding a quiet study space.\n\n"
        
        if any(word in struggles_lower for word in ['practice', 'apply', 'problem', 'exercise']):
            advice += "1. Start with easier problems to build confidence, then gradually increase difficulty.\n"
            advice += "2. Analyze your mistakes to understand where you went wrong and learn from them.\n"
            advice += "3. Try to solve problems without looking at solutions first, then check your work.\n\n"
        
        # Add general advice if specific struggles weren't detected
        if len(advice.split('\n')) < 5:
            advice += "General Study Tips:\n"
            advice += "• Review material regularly rather than cramming before exams\n"
            advice += "• Teach concepts to others to reinforce your understanding\n"
            advice += "• Take notes in your own words to process information actively\n"
            advice += "• Get enough sleep and exercise to maintain cognitive function\n"
            advice += "• Form study groups to discuss challenging topics\n"
        
        advice += f"\nRemember: Everyone learns differently. Experiment with these techniques to find what works best for you with {topic}."
        
        return advice
    
    except Exception as e:
        logger.error(f"Advice generation error: {e}")
        return f"Error generating advice: {str(e)}"


def extract_key_points(content, num_points=3):
    """
    Extract key points from content.
    
    Args:
        content (str): Source content
        num_points (int): Number of key points to extract
    
    Returns:
        list: List of key points
    """
    try:
        # Split into sentences and select most informative ones
        sentences = [s.strip() for s in content.split('.') if len(s.strip()) > 30]
        
        # Simple heuristic: longer sentences with specific keywords
        scored_sentences = []
        keywords = ['important', 'key', 'main', 'significant', 'essential', 'critical']
        
        for sentence in sentences:
            score = len(sentence.split())
            # Boost score if contains keywords
            for keyword in keywords:
                if keyword in sentence.lower():
                    score += 20
            scored_sentences.append((score, sentence))
        
        # Sort by score and take top N
        scored_sentences.sort(reverse=True)
        key_points = [s[1] for s in scored_sentences[:num_points]]
        
        return key_points if key_points else [content[:200]]
    
    except Exception as e:
        logger.error(f"Key point extraction error: {e}")
        return [content[:200]]


def answer_question(question, context):
    """
    Answer a question based on provided context using AI.
    
    Args:
        question (str): Question to answer
        context (str): Context containing the answer
    
    Returns:
        dict: Answer with confidence score
    """
    try:
        model = get_question_answering_model()
        if model is None:
            return {
                'answer': 'AI model not available. Please try again later.',
                'confidence': 0.0
            }
        
        result = model(question=question, context=context)
        
        return {
            'answer': result['answer'],
            'confidence': round(result['score'] * 100, 2),
            'start': result['start'],
            'end': result['end']
        }
    
    except Exception as e:
        logger.error(f"Question answering error: {e}")
        return {
            'answer': f"Error answering question: {str(e)}",
            'confidence': 0.0
        }


def analyze_study_sentiment(text):
    """
    Analyze the sentiment of study notes or reflections.
    
    Args:
        text (str): Text to analyze
    
    Returns:
        dict: Sentiment analysis results
    """
    try:
        model = get_sentiment_model()
        if model is None:
            return {
                'sentiment': 'neutral',
                'confidence': 0.0,
                'label': 'NEUTRAL'
            }
        
        result = model(text[:512])[0]  # Limit to 512 tokens
        
        return {
            'sentiment': result['label'].lower(),
            'confidence': round(result['score'] * 100, 2),
            'label': result['label']
        }
    
    except Exception as e:
        logger.error(f"Sentiment analysis error: {e}")
        return {
            'sentiment': 'neutral',
            'confidence': 0.0,
            'label': 'NEUTRAL',
            'error': str(e)
        }


def extract_keywords(text, num_keywords=10):
    """
    Extract important keywords from text using frequency analysis.
    
    Args:
        text (str): Text to analyze
        num_keywords (int): Number of keywords to extract
    
    Returns:
        list: List of (keyword, frequency) tuples
    """
    try:
        # Remove punctuation and convert to lowercase
        text_clean = re.sub(r'[^\w\s]', ' ', text.lower())
        
        # Common stop words to exclude
        stop_words = {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
            'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
            'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these',
            'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which',
            'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both',
            'few', 'more', 'most', 'other', 'some', 'such', 'than', 'too', 'very'
        }
        
        # Split into words and filter
        words = [w for w in text_clean.split() 
                if len(w) > 3 and w not in stop_words]
        
        # Count frequencies
        word_freq = Counter(words)
        
        # Get top keywords
        top_keywords = word_freq.most_common(num_keywords)
        
        return [{'keyword': word, 'frequency': freq} for word, freq in top_keywords]
    
    except Exception as e:
        logger.error(f"Keyword extraction error: {e}")
        return []


def generate_quiz_questions(content, num_questions=5):
    """
    Generate quiz questions from study content.
    
    Args:
        content (str): Source content
        num_questions (int): Number of questions to generate
    
    Returns:
        list: List of quiz questions with multiple choice options
    """
    try:
        # Split into sentences
        sentences = [s.strip() for s in content.split('.') if len(s.strip()) > 20]
        
        if not sentences:
            return []
        
        questions = []
        for i, sentence in enumerate(sentences[:num_questions]):
            words = sentence.split()
            if len(words) < 5:
                continue
            
            # Create a fill-in-the-blank question
            # Choose a meaningful word (not too short, not at start/end)
            mid_words = [(idx, w) for idx, w in enumerate(words[1:-1], 1) 
                        if len(w) > 4 and w.isalpha()]
            
            if not mid_words:
                continue
            
            # Select word to blank out
            blank_idx, blank_word = mid_words[len(mid_words) // 2]
            
            # Create question
            question_words = words.copy()
            question_words[blank_idx] = "______"
            
            # Generate distractors (wrong answers)
            all_words = [w for w in content.split() if len(w) > 4 and w.isalpha()]
            distractors = [w for w in set(all_words) if w != blank_word][:3]
            
            if len(distractors) < 3:
                distractors.extend(['option1', 'option2', 'option3'])
                distractors = distractors[:3]
            
            options = [blank_word] + distractors
            
            # Shuffle options (deterministic for same input)
            import random
            random.Random(i).shuffle(options)
            
            questions.append({
                'id': i + 1,
                'question': ' '.join(question_words) + '?',
                'options': options,
                'correct_answer': blank_word,
                'explanation': sentence
            })
        
        return questions
    
    except Exception as e:
        logger.error(f"Quiz generation error: {e}")
        return []

