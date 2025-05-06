import pickle
import re
import numpy as np
from scipy.sparse import hstack

# === 🔁 Load model artifacts ===
with open('ml/xgb_model.pkl', 'rb') as f:
    model = pickle.load(f)

with open('ml/tfidf_vectorizer.pkl', 'rb') as f:
    vectorizer = pickle.load(f)

with open('ml/label_encoder.pkl', 'rb') as f:
    label_encoder = pickle.load(f)

with open('ml/amount_scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

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

# === 🧪 Test Example ===
if __name__ == "__main__":
    test_description = input("Enter transaction description: ")
    test_amount = float(input("Enter amount in INR: "))
    predicted_category = predict_category(test_description, test_amount)
    print(f"✅ Predicted Category: {predicted_category}")
