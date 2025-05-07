import re
import pickle
import numpy as np
import requests
from scipy.sparse import hstack
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder, StandardScaler
from xgboost import XGBClassifier

# === 🌐 Load from Hugging Face URLs ===
HF_BASE = "https://huggingface.co/maharshijani05/spending_category/resolve/main/"  # 🔁 Replace with your actual repo
FILES = {
    "model": "xgb_model.pkl",
    "vectorizer": "tfidf_vectorizer.pkl",
    "label_encoder": "label_encoder.pkl",
    "scaler": "amount_scaler.pkl"
}

def load_pickle_from_url(url):
    response = requests.get(url)
    response.raise_for_status()
    return pickle.loads(response.content)

# === 🔁 Load Artifacts ===
model = load_pickle_from_url(HF_BASE + FILES["model"])
vectorizer = load_pickle_from_url(HF_BASE + FILES["vectorizer"])
label_encoder = load_pickle_from_url(HF_BASE + FILES["label_encoder"])
scaler = load_pickle_from_url(HF_BASE + FILES["scaler"])

# === 🧹 Clean description text ===
def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# === 🔮 Prediction Function ===
def predict_category(description, amount_inr):
    clean_desc = clean_text(description)
    desc_vector = vectorizer.transform([clean_desc])
    amount_scaled = scaler.transform(np.array([[amount_inr]]))
    combined_input = hstack([desc_vector, amount_scaled])
    prediction_encoded = model.predict(combined_input)[0]
    prediction_label = label_encoder.inverse_transform([prediction_encoded])[0]
    return prediction_label
