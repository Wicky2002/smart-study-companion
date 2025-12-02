"""
AI utility functions using Hugging Face transformers.
These models run locally without requiring API keys.
"""
from transformers import pipeline
import logging

logger = logging.getLogger(__name__)

# Cache for loaded models
_summarization_model = None
_text_generation_model = None


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
    Generate study plan suggestions using AI.
    
    Args:
        topic (str): Study topic
        duration_days (int): Number of days for the plan
        difficulty (str): Difficulty level
    
    Returns:
        str: Generated study plan text
    """
    try:
        model = get_text_generation_model()
        if model is None:
            return "AI model not available. Please try again later."
        
        prompt = f"Create a {duration_days}-day study plan for learning {topic} at {difficulty} level. Day 1:"
        
        result = model(
            prompt,
            max_length=200,
            num_return_sequences=1,
            temperature=0.7,
            do_sample=True
        )
        
        return result[0]['generated_text']
    
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
    Generate study advice using AI.
    
    Args:
        topic (str): Current study topic
        struggles (str): Student's struggles
    
    Returns:
        str: Generated advice
    """
    try:
        model = get_text_generation_model()
        if model is None:
            return "AI model not available. Please try again later."
        
        prompt = f"Study advice for {topic}. Student struggles with: {struggles}. Advice:"
        
        result = model(
            prompt,
            max_length=150,
            num_return_sequences=1,
            temperature=0.7,
            do_sample=True
        )
        
        return result[0]['generated_text']
    
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
