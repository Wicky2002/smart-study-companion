"""
Test script to verify AI models can be loaded successfully.
Run this to pre-download models before first use.
"""
import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("🤖 Testing AI Model Loading...\n")
print("=" * 60)

try:
    print("\n📥 Loading Transformers library...")
    from transformers import pipeline
    print("✅ Transformers loaded successfully!")
    
    print("\n📥 Loading PyTorch...")
    import torch
    print(f"✅ PyTorch version: {torch.__version__}")
    print(f"   CUDA available: {torch.cuda.is_available()}")
    
    print("\n📥 Testing Summarization Model (facebook/bart-large-cnn)...")
    print("   This will download ~1.6GB on first run...")
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn", device=-1)
    print("✅ Summarization model loaded!")
    
    # Test summarization
    test_text = """
    Machine learning is a subset of artificial intelligence that focuses on 
    the development of algorithms and statistical models that enable computers 
    to improve their performance on a specific task through experience. It involves 
    training models on data to make predictions or decisions without being explicitly 
    programmed to perform the task. Common applications include image recognition, 
    natural language processing, and recommendation systems.
    """
    print("\n🧪 Testing summarization...")
    result = summarizer(test_text, max_length=50, min_length=20, do_sample=False)
    print(f"   Input length: {len(test_text.split())} words")
    print(f"   Summary: {result[0]['summary_text']}")
    print("✅ Summarization working!")
    
    print("\n📥 Testing Text Generation Model (gpt2)...")
    print("   This will download ~500MB on first run...")
    generator = pipeline("text-generation", model="gpt2", device=-1)
    print("✅ Text generation model loaded!")
    
    # Test generation
    print("\n🧪 Testing text generation...")
    result = generator("Study tips:", max_length=50, num_return_sequences=1)
    print(f"   Generated: {result[0]['generated_text'][:100]}...")
    print("✅ Text generation working!")
    
    print("\n" + "=" * 60)
    print("✅ ALL AI MODELS WORKING SUCCESSFULLY!")
    print("=" * 60)
    print("\n🎉 Your Smart Study Companion AI is ready to use!")
    print("   Models are cached and will load faster next time.")
    
except Exception as e:
    print("\n" + "=" * 60)
    print("❌ ERROR LOADING AI MODELS")
    print("=" * 60)
    print(f"\nError: {str(e)}")
    print("\nTroubleshooting:")
    print("1. Ensure you have enough RAM (4GB minimum)")
    print("2. Check your internet connection")
    print("3. Try running: pip install transformers torch sentencepiece --upgrade")
    print("4. Free up disk space (~3GB needed)")
    sys.exit(1)
