from transformers import pipeline, AutoModel, AutoTokenizer
from sentence_transformers import SentenceTransformer
import spacy
import os

class MLModels:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._loaded = False
        return cls._instance
    
    def load_all(self):
        if self._loaded:
            return
        
        print("Loading ML models...")
        
        # 1. Sentence Transformer for semantic similarity (skill matching)
        self.skill_encoder = SentenceTransformer('all-MiniLM-L6-v2')
        
        # 2. Text classification for competency assessment
        self.classifier = pipeline(
            "zero-shot-classification",
            model="facebook/bart-large-mnli"
        )
        
        # 3. Text generation for MCQ creation
        self.text_generator = pipeline(
            "text2text-generation",
            model="google/flan-t5-base"
        )
        
        # 4. Question generation pipeline
        self.question_generator = pipeline(
            "text2text-generation",
            model="mrm8488/t5-base-finetuned-question-generation-ap"
        )
        
        # 5. NLP for document processing
        self.nlp = spacy.load("en_core_web_sm")
        
        # 6. Summarization for content processing
        self.summarizer = pipeline(
            "summarization",
            model="facebook/bart-large-cnn"
        )
        
        self._loaded = True
        print("All ML models loaded successfully!")
    
    def unload_all(self):
        self.skill_encoder = None
        self.classifier = None
        self.text_generator = None
        self.question_generator = None
        self.nlp = None
        self.summarizer = None
        self._loaded = False
        print("ML models unloaded.")
    
    def is_loaded(self):
        return self._loaded
