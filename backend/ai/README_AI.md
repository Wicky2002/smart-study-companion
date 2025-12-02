# AI Features Documentation

## Overview

The Smart Study Companion uses **real AI models** powered by Hugging Face Transformers to provide intelligent study assistance. These models run locally without requiring API keys or internet connectivity after the initial download.

## Models Used

### 1. Summarization Model
- **Model**: `facebook/bart-large-cnn`
- **Purpose**: Generate concise summaries of study materials
- **Size**: ~1.6GB
- **Performance**: High-quality summaries with good comprehension

### 2. Text Generation Model
- **Model**: `gpt2`
- **Purpose**: Generate study plans and advice
- **Size**: ~500MB
- **Performance**: Creative text generation for educational content

## Features

### 1. Text Summarization (`/api/ai/generate-summary/`)
- Analyzes study content and generates concise summaries
- Extracts key points automatically
- Provides compression ratio statistics
- **Minimum content**: 100 characters

**Request:**
```json
{
  "content": "Your study material here..."
}
```

**Response:**
```json
{
  "summary": "AI-generated summary...",
  "key_points": ["Point 1", "Point 2", "Point 3"],
  "word_count": 500,
  "summary_word_count": 120,
  "compression_ratio": "24.0%"
}
```

### 2. Study Plan Generation (`/api/ai/generate-study-plan/`)
- Creates personalized study schedules
- AI-powered daily task suggestions
- Adapts to difficulty level
- Includes study tips and best practices

**Request:**
```json
{
  "topic": "Python Programming",
  "duration_days": 7,
  "difficulty": "intermediate"
}
```

**Response:**
```json
{
  "study_plan": {
    "topic": "Python Programming",
    "duration": 7,
    "difficulty": "intermediate",
    "daily_tasks": [...],
    "ai_generated_overview": "AI-generated plan...",
    "tips": [...]
  }
}
```

### 3. Flashcard Generation (`/api/ai/generate-flashcards/`)
- Automatically creates question-answer pairs
- Extracts important concepts
- Includes context for better learning
- Supports 1-20 flashcards per request

**Request:**
```json
{
  "content": "Study material...",
  "num_cards": 5
}
```

**Response:**
```json
{
  "flashcards": [
    {
      "id": 1,
      "question": "Generated question?",
      "answer": "Generated answer",
      "full_context": "Context..."
    }
  ],
  "total_generated": 5,
  "source_length": 250
}
```

### 4. Study Advice (`/api/ai/get-study-advice/`)
- Personalized learning recommendations
- AI-generated tips based on struggles
- Suggested resources and techniques
- Adaptive advice for different topics

**Request:**
```json
{
  "current_topic": "Data Structures",
  "struggles": "Understanding recursion"
}
```

**Response:**
```json
{
  "advice": ["AI-generated advice..."],
  "recommended_resources": [...],
  "study_techniques": [...],
  "personalized_tip": "AI-generated tip..."
}
```

## Installation

### Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**Note**: First-time installation will take longer as it downloads:
- transformers (~200MB)
- torch (~800MB for CPU version)
- Model weights will download on first use (~2GB total)

### System Requirements

- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: ~3GB free space for models
- **CPU**: Any modern CPU (GPU not required but can speed up processing)

## First Run

On the first API call to any AI endpoint:
1. The required model will automatically download
2. This may take 5-10 minutes depending on internet speed
3. Models are cached locally for future use
4. Subsequent calls will be much faster

## Performance

### CPU Processing Times (Approximate)
- **Summarization**: 5-15 seconds (depending on text length)
- **Text Generation**: 10-20 seconds
- **Flashcard Generation**: 2-5 seconds
- **Study Advice**: 10-20 seconds

### GPU Processing (Optional)
To use GPU acceleration:
1. Install CUDA-enabled PyTorch
2. Update `ai_utils.py`: Change `device=-1` to `device=0`
3. Processing will be 5-10x faster

## Rate Limiting

- **Throttle**: 10 requests per minute per user
- **Purpose**: Prevent server overload and ensure fair usage
- **Response**: HTTP 429 if limit exceeded

## Logging

All AI requests are logged in the database:
- User ID
- Prompt sent to model
- Response generated
- Timestamp

Access logs via Django admin: `/admin/study/airequestlog/`

## Troubleshooting

### Model Download Fails
- **Issue**: Network timeout during download
- **Solution**: Retry the request or manually download models
- **Manual Download**: Use Hugging Face CLI

### Out of Memory Error
- **Issue**: Insufficient RAM
- **Solution**: 
  1. Close other applications
  2. Reduce input text length
  3. Use a smaller model variant

### Slow Performance
- **Issue**: CPU processing is slow
- **Solution**:
  1. Consider GPU acceleration
  2. Reduce input text length
  3. Upgrade server hardware

## Customization

### Change Models

Edit `ai/ai_utils.py`:

```python
# For faster but less accurate summarization
_summarization_model = pipeline(
    "summarization",
    model="sshleifer/distilbart-cnn-12-6",  # Smaller, faster
    device=-1
)

# For better text generation (requires more RAM)
_text_generation_model = pipeline(
    "text-generation",
    model="gpt2-medium",  # Larger, better quality
    device=-1
)
```

### Adjust Output Length

In `ai_utils.py`, modify parameters:

```python
summary = model(
    content,
    max_length=200,  # Increase for longer summaries
    min_length=75,   # Increase minimum length
    do_sample=False
)
```

## Alternative: OpenAI Integration

To use OpenAI instead of local models:

1. Uncomment in `requirements.txt`:
```
openai==1.12.0
```

2. Set environment variable:
```bash
export OPENAI_API_KEY='your-api-key'
```

3. Update `ai_utils.py` to use OpenAI API

**Pros**: Better quality, faster responses
**Cons**: Requires API key, costs money, needs internet

## Privacy & Security

- ✅ All processing happens locally (no data sent to external APIs)
- ✅ User data stays on your server
- ✅ No API keys or external dependencies required
- ✅ GDPR compliant (data not shared with third parties)

## Support

For issues or questions:
1. Check model loading logs in Django console
2. Verify CUDA availability: `torch.cuda.is_available()`
3. Test models independently with `python manage.py shell`

## Credits

- **Hugging Face**: Transformers library and models
- **Facebook**: BART summarization model
- **OpenAI**: GPT-2 text generation model
