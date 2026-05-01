"""
Satyam Controls ML Service
Complete ML implementation with Decision Tree, Random Forest, Reinforcement Learning
"""

import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import joblib
import os
import re
import json
import logging
from collections import defaultdict
from datetime import datetime

# Scikit-learn imports
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.linear_model import LogisticRegression

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============ FASTAPI APP ============
app = FastAPI(title="Satyam Controls ML Service", version="2.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============ MODEL DIRECTORY ============
MODEL_DIR = "./models"
os.makedirs(MODEL_DIR, exist_ok=True)

# ============ 1. DECISION TREE FOR INTENT CLASSIFICATION ============
class MultilingualIntentClassifier:
    """Decision Tree classifier for intent detection across 4 languages"""
    
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 3))
        self.classifier = DecisionTreeClassifier(max_depth=15, min_samples_split=5, random_state=42)
        self.label_encoder = LabelEncoder()
        self.is_trained = False
        
        # Multilingual keyword patterns
        self.keywords = {
            'product_query': {
                'en': ['product', 'valve', 'fitting', 'manifold', 'gauge', 'where is', 'show me', 'find', 'compression', 'union', 'ball', 'needle', 'check', 'tube', 'connector'],
                'hi': ['उत्पाद', 'वाल्व', 'फिटिंग', 'मैनिफोल्ड', 'गेज', 'कहाँ है', 'दिखाओ', 'ढूंढो', 'कंप्रेशन', 'यूनियन', 'बॉल', 'नीडल', 'चेक'],
                'mr': ['उत्पादन', 'वाल्व', 'फिटिंग', 'मॅनिफोल्ड', 'गेज', 'कुठे आहे', 'दाखवा', 'शोधा'],
                'kn': ['ಉತ್ಪನ್ನ', 'ವಾಲ್ವ್', 'ಫಿಟ್ಟಿಂಗ್', 'ಮ್ಯಾನಿಫೋಲ್ಡ್', 'ಗೇಜ್', 'ಎಲ್ಲಿದೆ', 'ತೋರಿಸು', 'ಹುಡುಕು']
            },
            'contact': {
                'en': ['contact', 'phone', 'call', 'email', 'number', 'reach', 'whatsapp'],
                'hi': ['संपर्क', 'फोन', 'कॉल', 'ईमेल', 'नंबर'],
                'mr': ['संपर्क', 'फोन', 'कॉल', 'ईमेल', 'नंबर'],
                'kn': ['ಸಂಪರ್ಕ', 'ಫೋನ್', 'ಕಾಲ್', 'ಇಮೇಲ್', 'ಸಂಖ್ಯೆ']
            },
            'address': {
                'en': ['address', 'location', 'where are you', 'office', 'factory', 'shop'],
                'hi': ['पता', 'स्थान', 'कहाँ हो', 'कार्यालय', 'फैक्ट्री'],
                'mr': ['पत्ता', 'स्थान', 'कुठे आहात', 'कार्यालय', 'कारखाना'],
                'kn': ['ವಿಳಾಸ', 'ಸ್ಥಳ', 'ಎಲ್ಲಿದ್ದೀರಿ', 'ಕಚೇರಿ', 'ಕಾರ್ಖಾನೆ']
            },
            'hours': {
                'en': ['hours', 'time', 'open', 'closed', 'working', 'schedule', 'timing'],
                'hi': ['समय', 'खुला', 'बंद', 'कार्य', 'अनुसूची'],
                'mr': ['वेळ', 'उघडे', 'बंद', 'कार्य', 'वेळापत्रक'],
                'kn': ['ಸಮಯ', 'ತೆರೆದಿದೆ', 'ಮುಚ್ಚಿದೆ', 'ಕೆಲಸ', 'ವೇಳಾಪಟ್ಟಿ']
            },
            'greeting': {
                'en': ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good evening', 'hola'],
                'hi': ['नमस्ते', 'हाय', 'हेलो', 'सुप्रभात', 'शुभ संध्या'],
                'mr': ['नमस्कार', 'हाय', 'हेलो', 'शुभ प्रभात', 'शुभ संध्या'],
                'kn': ['ನಮಸ್ಕಾರ', 'ಹಾಯ್', 'ಹಲೋ', 'ಶುಭೋದಯ', 'ಶುಭ ಸಂಜೆ']
            },
            'thankyou': {
                'en': ['thanks', 'thank you', 'dhanyavaad', 'shukriya', 'appreciate'],
                'hi': ['धन्यवाद', 'शुक्रिया', 'थैंक्यू'],
                'mr': ['धन्यवाद', 'शुक्रिया', 'थँक्यू'],
                'kn': ['ಧನ್ಯವಾದ', 'ಶುಕ್ರಿಯಾ', 'ಥ್ಯಾಂಕ್ಯೂ']
            },
            'buying': {
                'en': ['buy', 'purchase', 'order', 'price', 'cost', 'quote', 'how to buy'],
                'hi': ['खरीद', 'खरीदें', 'ऑर्डर', 'कीमत', 'कोट', 'कैसे खरीदें'],
                'mr': ['खरेदी', 'ऑर्डर', 'किंमत', 'कोट', 'कसे खरेदी करावे'],
                'kn': ['ಖರೀದಿ', 'ಆರ್ಡರ್', 'ಬೆಲೆ', 'ಕೋಟ್', 'ಹೇಗೆ ಖರೀದಿಸಬೇಕು']
            },
            'recommendation': {
                'en': ['recommend', 'suggest', 'best', 'which one', 'suitable', 'for me'],
                'hi': ['सुझाव', 'सिफारिश', 'सर्वश्रेष्ठ', 'कौन सा', 'उपयुक्त'],
                'mr': ['सूचना', 'शिफारस', 'सर्वोत्तम', 'कोणते', 'योग्य'],
                'kn': ['ಶಿಫಾರಸು', 'ಸಲಹೆ', 'ಅತ್ಯುತ್ತಮ', 'ಯಾವುದು', 'ಸೂಕ್ತ']
            },
            'technical_question': {
                'en': ['pressure', 'psi', 'temperature', 'material', 'steel', 'brass', 'application', 'use for'],
                'hi': ['दबाव', 'तापमान', 'सामग्री', 'स्टील', 'पीतल', 'उपयोग'],
                'mr': ['दाब', 'तापमान', 'सामग्री', 'स्टील', 'पितळ', 'वापर'],
                'kn': ['ಒತ್ತಡ', 'ತಾಪಮಾನ', 'ವಸ್ತು', 'ಸ್ಟೀಲ್', 'ಹಿತ್ತಾಳೆ', 'ಬಳಕೆ']
            },
            'complaint': {
                'en': ['complaint', 'issue', 'problem', 'not working', 'delay', 'bad', 'poor'],
                'hi': ['शिकायत', 'समस्या', 'काम नहीं', 'देरी', 'खराब'],
                'mr': ['तक्रार', 'समस्या', 'काम करत नाही', 'उशीर', 'वाईट'],
                'kn': ['ದೂರು', 'ಸಮಸ್ಯೆ', 'ಕೆಲಸ ಮಾಡುತ್ತಿಲ್ಲ', 'ವಿಳಂಬ', 'ಕೆಟ್ಟದು']
            }
        }
    
    def detect_language(self, text):
        """Simple language detection"""
        if re.search(r'[\u0900-\u097F]', text):
            return 'hi'
        if re.search(r'[\u0C80-\u0CFF]', text):
            return 'kn'
        return 'en'
    
    def train(self, texts, labels):
        """Train the decision tree classifier"""
        try:
            # TF-IDF Vectorization
            X = self.vectorizer.fit_transform(texts)
            
            # Label encoding
            y = self.label_encoder.fit_transform(labels)
            
            # Train decision tree
            self.classifier.fit(X, y)
            self.is_trained = True
            
            # Save models
            joblib.dump(self.vectorizer, f"{MODEL_DIR}/intent_vectorizer.joblib")
            joblib.dump(self.classifier, f"{MODEL_DIR}/intent_classifier.joblib")
            joblib.dump(self.label_encoder, f"{MODEL_DIR}/intent_label_encoder.joblib")
            
            logger.info(f"Intent classifier trained on {len(texts)} samples")
            return True
        except Exception as e:
            logger.error(f"Training error: {e}")
            return False
    
    def predict(self, text):
        """Predict intent with confidence"""
        text_lower = text.lower()
        lang = self.detect_language(text)
        
        # First try keyword-based for speed
        max_score = 0
        detected_intent = 'other'
        
        for intent, lang_keywords in self.keywords.items():
            keywords = lang_keywords.get(lang, lang_keywords.get('en', []))
            score = sum(1 for kw in keywords if kw.lower() in text_lower)
            if score > max_score:
                max_score = score
                detected_intent = intent
        
        if max_score > 0:
            confidence = min(0.5 + max_score * 0.1, 0.95)
            return {
                'intent': detected_intent,
                'confidence': round(confidence, 3),
                'detected_language': lang,
                'method': 'keyword'
            }
        
        # If trained model exists, use it
        if self.is_trained:
            try:
                X = self.vectorizer.transform([text])
                proba = self.classifier.predict_proba(X)[0]
                pred_idx = self.classifier.predict(X)[0]
                intent = self.label_encoder.inverse_transform([pred_idx])[0]
                confidence = float(proba[pred_idx])
                
                return {
                    'intent': intent,
                    'confidence': round(confidence, 3),
                    'detected_language': lang,
                    'method': 'ml'
                }
            except Exception as e:
                logger.error(f"ML prediction error: {e}")
        
        return {
            'intent': 'other',
            'confidence': 0.5,
            'detected_language': lang,
            'method': 'fallback'
        }

# ============ 2. RANDOM FOREST LEAD SCORER ============
class LeadScorer:
    """Random Forest model for lead scoring"""
    
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
        self.feature_names = ['sentiment_score', 'time_on_site', 'product_clicks', 'page_views', 'session_count']
    
    def train(self, data):
        """Train Random Forest on historical data"""
        try:
            X = np.array([[d.get(f, 0) for f in self.feature_names] for d in data])
            y = np.array([d.get('lead_score', 50) for d in data])
            
            X_scaled = self.scaler.fit_transform(X)
            self.model.fit(X_scaled, y)
            self.is_trained = True
            
            joblib.dump(self.model, f"{MODEL_DIR}/lead_scorer.joblib")
            joblib.dump(self.scaler, f"{MODEL_DIR}/lead_scaler.joblib")
            
            logger.info(f"Lead scorer trained on {len(data)} samples")
            return True
        except Exception as e:
            logger.error(f"Lead scorer training error: {e}")
            return False
    
    def predict(self, features):
        """Predict lead score (0-100)"""
        try:
            X = np.array([[features.get(f, 0) for f in self.feature_names]])
            
            if self.is_trained:
                X_scaled = self.scaler.transform(X)
                score = self.model.predict(X_scaled)[0]
            else:
                # Fallback formula
                sentiment_score = (features.get('sentiment_score', 0) + 1) * 50
                time_score = min(features.get('time_on_site', 0) / 6, 100)
                click_score = min(features.get('product_clicks', 0) * 10, 100)
                page_score = min(features.get('page_views', 1) * 5, 100)
                score = (sentiment_score * 0.4 + time_score * 0.3 + click_score * 0.2 + page_score * 0.1)
            
            score = max(0, min(100, score))
            
            if score >= 70:
                quality = "Hot"
            elif score >= 40:
                quality = "Warm"
            else:
                quality = "Cold"
            
            return {
                'score': int(score),
                'quality': quality,
                'conversion_probability': int(score * 0.85)
            }
        except Exception as e:
            logger.error(f"Lead score prediction error: {e}")
            return {'score': 50, 'quality': 'Warm', 'conversion_probability': 42}

# ============ 3. SENTIMENT ANALYZER ============
class SentimentAnalyzer:
    """Sentiment analysis using ML and lexicon"""
    
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=1000)
        self.classifier = LogisticRegression(random_state=42, max_iter=1000)
        self.is_trained = False
        
        # Lexicon for fallback
        self.positive_words = {
            'en': ['good', 'great', 'excellent', 'best', 'love', 'helpful', 'thanks', 'amazing', 'perfect', 'wonderful'],
            'hi': ['अच्छा', 'बढ़िया', 'उत्कृष्ट', 'सर्वश्रेष्ठ', 'धन्यवाद', 'शानदार', 'बहुत अच्छा'],
            'mr': ['चांगला', 'उत्तम', 'उत्कृष्ट', 'सर्वोत्तम', 'धन्यवाद', 'छान', 'खूप छान'],
            'kn': ['ಒಳ್ಳೆಯ', 'ಅದ್ಭುತ', 'ಉತ್ತಮ', 'ಅತ್ಯುತ್ತಮ', 'ಧನ್ಯವಾದ', 'ಚೆನ್ನಾಗಿದೆ']
        }
        
        self.negative_words = {
            'en': ['bad', 'worst', 'terrible', 'issue', 'problem', 'broken', 'complaint', 'delay', 'poor'],
            'hi': ['खराब', 'समस्या', 'शिकायत', 'देरी', 'गलत', 'टूटा'],
            'mr': ['वाईट', 'समस्या', 'तक्रार', 'उशीर', 'चुकीचे', 'तुटलेले'],
            'kn': ['ಕೆಟ್ಟ', 'ಸಮಸ್ಯೆ', 'ದೂರು', 'ವಿಳಂಬ', 'ತಪ್ಪು', 'ಮುರಿದ']
        }
        
        self.urgent_words = {
            'en': ['urgent', 'asap', 'immediately', 'emergency', 'critical', 'quick', 'fast'],
            'hi': ['जल्दी', 'तुरंत', 'आपातकालीन', 'महत्वपूर्ण', 'त्वरित'],
            'mr': ['लगेच', 'तातडीने', 'आपत्कालीन', 'गंभीर', 'त्वरित'],
            'kn': ['ತುರ್ತು', 'ತಕ್ಷಣ', 'ಅಗತ್ಯ', 'ಗಂಭೀರ', 'ಶೀಘ್ರ']
        }
    
    def detect_language(self, text):
        if re.search(r'[\u0900-\u097F]', text):
            return 'hi'
        if re.search(r'[\u0C80-\u0CFF]', text):
            return 'kn'
        return 'en'
    
    def train(self, texts, labels):
        """Train sentiment classifier"""
        try:
            X = self.vectorizer.fit_transform(texts)
            self.classifier.fit(X, labels)
            self.is_trained = True
            
            joblib.dump(self.vectorizer, f"{MODEL_DIR}/sentiment_vectorizer.joblib")
            joblib.dump(self.classifier, f"{MODEL_DIR}/sentiment_classifier.joblib")
            
            logger.info(f"Sentiment classifier trained on {len(texts)} samples")
            return True
        except Exception as e:
            logger.error(f"Sentiment training error: {e}")
            return False
    
    def analyze(self, text):
        """Analyze sentiment of text"""
        text_lower = text.lower()
        lang = self.detect_language(text)
        
        # Lexicon-based analysis
        pos_words = self.positive_words.get(lang, self.positive_words['en'])
        neg_words = self.negative_words.get(lang, self.negative_words['en'])
        urgent_words = self.urgent_words.get(lang, self.urgent_words['en'])
        
        pos_count = sum(1 for w in pos_words if w in text_lower)
        neg_count = sum(1 for w in neg_words if w in text_lower)
        urgent_count = sum(1 for w in urgent_words if w in text_lower)
        
        total = pos_count + neg_count
        if total > 0:
            score = (pos_count - neg_count) / total
        else:
            score = 0
        
        # Determine label
        if urgent_count > 0:
            label = "Urgent"
            emotion = "anxious"
        elif score > 0.5:
            label = "Very Interested"
            emotion = "excited"
        elif score > 0.1:
            label = "Interested"
            emotion = "positive"
        elif score < -0.3:
            label = "Complaint"
            emotion = "frustrated"
        else:
            label = "Neutral"
            emotion = "neutral"
        
        return {
            'score': round(score, 3),
            'label': label,
            'emotion': emotion,
            'confidence': round(0.7 + abs(score) * 0.3, 3),
            'urgent': urgent_count > 0,
            'detected_language': lang
        }

# ============ 4. REINFORCEMENT LEARNING AGENT ============
class RLAgent:
    """Q-Learning Reinforcement Learning Agent"""
    
    def __init__(self, actions=['helpful', 'short', 'detailed', 'navigation']):
        self.actions = actions
        self.q_table = {}
        self.learning_rate = 0.1
        self.discount_factor = 0.95
        self.epsilon = 0.1
    
    def get_state_key(self, state):
        """Convert state to string key"""
        return f"{state.get('intent', 'other')}_{state.get('sentiment', 'neutral')}_{state.get('time_bucket', 0)}"
    
    def choose_action(self, state):
        """Choose action using epsilon-greedy"""
        state_key = self.get_state_key(state)
        
        if np.random.random() < self.epsilon:
            return np.random.randint(len(self.actions))
        
        if state_key not in self.q_table:
            self.q_table[state_key] = np.zeros(len(self.actions))
        
        return int(np.argmax(self.q_table[state_key]))
    
    def update(self, state, action, reward, next_state):
        """Update Q-values using Bellman equation"""
        state_key = self.get_state_key(state)
        next_key = self.get_state_key(next_state)
        
        if state_key not in self.q_table:
            self.q_table[state_key] = np.zeros(len(self.actions))
        if next_key not in self.q_table:
            self.q_table[next_key] = np.zeros(len(self.actions))
        
        current_q = self.q_table[state_key][action]
        max_next_q = np.max(self.q_table[next_key])
        new_q = current_q + self.learning_rate * (reward + self.discount_factor * max_next_q - current_q)
        
        self.q_table[state_key][action] = new_q
    
    def get_reward(self, user_response):
        """Calculate reward based on user feedback"""
        lower_response = user_response.lower()
        if 'thank' in lower_response:
            return 10
        if 'great' in lower_response or 'perfect' in lower_response:
            return 8
        if 'yes' in lower_response or 'ok' in lower_response or 'good' in lower_response:
            return 5
        if 'no' in lower_response:
            return -2
        return 0
    
    def get_action_name(self, action_index):
        """Get action name from index"""
        if 0 <= action_index < len(self.actions):
            return self.actions[action_index]
        return 'helpful'

# ============ 5. PRODUCT MATCHER ============
class ProductMatcher:
    """TF-IDF based product matching"""
    
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=1000, ngram_range=(1, 2))
        self.product_features = None
        self.product_names = []
        self.product_data = []
        
    def build_index(self, products):
        """Build TF-IDF index from products"""
        if not products:
            return
        
        self.product_data = products
        self.product_names = [p.get('name', '') for p in products]
        
        # Create document for each product
        documents = []
        for p in products:
            doc = f"{p.get('name', '')} {p.get('description', '')} {p.get('pressure', '')} {p.get('material', '')}"
            documents.append(doc.lower())
        
        self.product_features = self.vectorizer.fit_transform(documents)
        logger.info(f"Product index built with {len(products)} products")
    
    def find_matching_products(self, query, top_k=5):
        """Find products matching user query"""
        if self.product_features is None:
            return []
        
        query_vec = self.vectorizer.transform([query.lower()])
        similarities = cosine_similarity(query_vec, self.product_features)[0]
        
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        
        results = []
        for idx in top_indices:
            if similarities[idx] > 0.1:
                results.append({
                    'name': self.product_names[idx],
                    'similarity': float(similarities[idx]),
                    'product_data': self.product_data[idx] if idx < len(self.product_data) else {}
                })
        
        return results
    
    def extract_requirements(self, query):
        """Extract technical requirements from query"""
        query_lower = query.lower()
        requirements = {}
        
        # Extract pressure
        pressure_match = re.search(r'(\d+)\s*(?:psi|pressure|प्रेशर|दबाव)', query_lower)
        if pressure_match:
            requirements['pressure'] = f"{pressure_match.group(1)} PSI"
        
        # Extract temperature
        temp_match = re.search(r'(\d+)\s*(?:°c|celsius|temperature|तापमान)', query_lower)
        if temp_match:
            requirements['temperature'] = f"{temp_match.group(1)}°C"
        
        # Detect material
        materials = {
            'stainless steel': 'SS 316',
            'ss': 'SS 316',
            'stainless': 'SS 316',
            'brass': 'Brass',
            'पीतल': 'Brass',
            'carbon steel': 'Carbon Steel',
            'steel': 'Carbon Steel'
        }
        
        for mat_key, mat_val in materials.items():
            if mat_key in query_lower:
                requirements['material'] = mat_val
                break
        
        # Detect application
        apps = {
            'steam': 'Steam Service',
            'भाप': 'Steam Service',
            'chemical': 'Chemical Processing',
            'रासायनिक': 'Chemical Processing',
            'water': 'Water Treatment',
            'पानी': 'Water Treatment',
            'instrument': 'Instrumentation',
            'इंस्ट्रूमेंट': 'Instrumentation'
        }
        
        for app_key, app_val in apps.items():
            if app_key in query_lower:
                requirements['application'] = app_val
                break
        
        return requirements

# ============ API MODELS ============
class QueryRequest(BaseModel):
    text: str
    language: Optional[str] = 'en'
    context: Dict[str, Any] = {}

class IntentResponse(BaseModel):
    intent: str
    confidence: float
    detected_language: str
    method: str

class SentimentResponse(BaseModel):
    score: float
    label: str
    emotion: str
    confidence: float
    urgent: bool
    detected_language: str

class LeadScoreResponse(BaseModel):
    score: int
    quality: str
    conversion_probability: int

class ProductRecommendationResponse(BaseModel):
    products: List[Dict[str, Any]]
    requirements: Dict[str, Any]

class FullAnalysisResponse(BaseModel):
    intent: Dict[str, Any]
    sentiment: Dict[str, Any]
    lead_score: Dict[str, Any]
    recommendations: List[Dict[str, Any]]
    requirements: Dict[str, Any]
    rl_action: int

# ============ INITIALIZE MODELS ============
intent_classifier = MultilingualIntentClassifier()
sentiment_analyzer = SentimentAnalyzer()
lead_scorer = LeadScorer()
rl_agent = RLAgent()
product_matcher = ProductMatcher()

# Sample training data for initial models
def initialize_models():
    """Initialize models with sample data"""
    
    # Intent training data
    intent_samples = [
        ("where is compression union", "product_query"),
        ("show me ball valve", "product_query"),
        ("how to find products", "navigation_help"),
        ("contact number", "contact"),
        ("what is your address", "address"),
        ("business hours", "hours"),
        ("hi hello", "greeting"),
        ("thank you", "thankyou"),
        ("how to buy", "buying"),
        ("which valve is best", "recommendation"),
        ("6000 psi valve", "technical_question"),
        ("product not working", "complaint"),
        ("मुझे बॉल वाल्व चाहिए", "product_query"),
        ("कंप्रेशन यूनियन कहाँ है", "product_query"),
        ("संपर्क नंबर", "contact"),
        ("पता क्या है", "address"),
        ("कितने बजे खुलता है", "hours"),
        ("नमस्ते", "greeting"),
        ("धन्यवाद", "thankyou"),
        ("कैसे खरीदें", "buying"),
        ("कौन सा वाल्व बेहतर है", "recommendation"),
        ("6000 PSI वाल्व", "technical_question"),
        ("प्रोडक्ट खराब है", "complaint")
    ]
    
    texts = [s[0] for s in intent_samples]
    labels = [s[1] for s in intent_samples]
    intent_classifier.train(texts, labels)
    
    # Sentiment training data
    sentiment_samples = [
        ("This product is great!", "positive"),
        ("Very poor quality", "negative"),
        ("Excellent service", "positive"),
        ("Terrible experience", "negative"),
        ("Good product", "positive"),
        ("Bad customer service", "negative"),
        ("I love this", "positive"),
        ("Not working", "negative"),
        ("बहुत अच्छा", "positive"),
        ("खराब गुणवत्ता", "negative"),
        ("उत्कृष्ट सेवा", "positive"),
        ("समस्या है", "negative")
    ]
    
    sent_texts = [s[0] for s in sentiment_samples]
    sent_labels = [s[1] for s in sentiment_samples]
    sentiment_analyzer.train(sent_texts, sent_labels)
    
    # Lead scoring training data
    lead_samples = [
        {'sentiment_score': 0.8, 'time_on_site': 300, 'product_clicks': 5, 'page_views': 10, 'lead_score': 85},
        {'sentiment_score': -0.5, 'time_on_site': 30, 'product_clicks': 0, 'page_views': 2, 'lead_score': 20},
        {'sentiment_score': 0.3, 'time_on_site': 120, 'product_clicks': 2, 'page_views': 5, 'lead_score': 55},
        {'sentiment_score': 0.9, 'time_on_site': 500, 'product_clicks': 8, 'page_views': 15, 'lead_score': 95},
    ]
    lead_scorer.train(lead_samples)
    
    logger.info("All models initialized with sample data")

# Call initialization
initialize_models()

# ============ API ENDPOINTS ============
@app.get("/")
async def root():
    return {"message": "Satyam Controls ML Service", "status": "running", "version": "2.0"}

@app.get("/health")
async def health():
    return {"status": "healthy", "models_loaded": True}

@app.post("/api/intent", response_model=IntentResponse)
async def detect_intent(request: QueryRequest):
    """Detect intent from user query"""
    result = intent_classifier.predict(request.text)
    return result

@app.post("/api/sentiment", response_model=SentimentResponse)
async def analyze_sentiment(request: QueryRequest):
    """Analyze sentiment of user query"""
    result = sentiment_analyzer.analyze(request.text)
    return result

@app.post("/api/leadscore", response_model=LeadScoreResponse)
async def calculate_lead_score(request: QueryRequest):
    """Calculate lead score based on user behavior"""
    features = {
        'sentiment_score': request.context.get('sentiment_score', 0),
        'time_on_site': request.context.get('time_on_site', 0),
        'product_clicks': request.context.get('product_clicks', 0),
        'page_views': request.context.get('page_views', 1),
        'session_count': request.context.get('session_count', 1)
    }
    result = lead_scorer.predict(features)
    return result

@app.post("/api/recommend", response_model=ProductRecommendationResponse)
async def get_recommendations(request: QueryRequest):
    """Get product recommendations based on user query"""
    matches = product_matcher.find_matching_products(request.text)
    requirements = product_matcher.extract_requirements(request.text)
    return {
        'products': matches,
        'requirements': requirements
    }

@app.post("/api/analyze", response_model=FullAnalysisResponse)
async def full_analysis(request: QueryRequest):
    """Complete analysis with all ML models"""
    intent = intent_classifier.predict(request.text)
    sentiment = sentiment_analyzer.analyze(request.text)
    
    # Update context with sentiment score
    context = request.context.copy()
    context['sentiment_score'] = sentiment['score']
    
    lead_score = lead_scorer.predict(context)
    recommendations = product_matcher.find_matching_products(request.text)
    requirements = product_matcher.extract_requirements(request.text)
    
    # RL action selection
    rl_state = {
        'intent': intent['intent'],
        'sentiment': sentiment['label'],
        'time_bucket': min(context.get('time_on_site', 0) // 60, 5)
    }
    rl_action = rl_agent.choose_action(rl_state)
    
    return {
        'intent': intent,
        'sentiment': sentiment,
        'lead_score': lead_score,
        'recommendations': recommendations,
        'requirements': requirements,
        'rl_action': rl_action
    }

@app.post("/api/feedback")
async def provide_feedback(request: QueryRequest):
    """Provide feedback for RL agent"""
    state = request.context.get('state', {})
    action = request.context.get('action', 0)
    reward = request.context.get('reward', 0)
    next_state = request.context.get('next_state', {})
    rl_agent.update(state, action, reward, next_state)
    return {"success": True}

# ============ START SERVER ============
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)