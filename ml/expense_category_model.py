# === 📚 Libraries ===
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler
from scipy.sparse import hstack
from xgboost import XGBClassifier
import re
import pickle
import os

# === 📂 Load dataset ===
df = pd.read_csv("warehouse/transaction_features.csv")  # Ensure correct path

# === 🧹 Clean description text ===
def clean_text(text):
    if pd.isnull(text):
        return ""
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

df['clean_description'] = df['description'].apply(clean_text)

# === 🎯 Encode category (target variable) ===
label_encoder = LabelEncoder()
df['category_encoded'] = label_encoder.fit_transform(df['category'])

# === ✂️ Train-test split ===
X_text = df['clean_description']
X_amount = df[['amount_inr']]  # numeric column
y = df['category_encoded']

X_text_train, X_text_test, X_amount_train, X_amount_test, y_train, y_test = train_test_split(
    X_text, X_amount, y, test_size=0.2, random_state=42
)

# === 🔤 TF-IDF Vectorization ===
vectorizer = TfidfVectorizer(stop_words='english')
X_text_train_tfidf = vectorizer.fit_transform(X_text_train)
X_text_test_tfidf = vectorizer.transform(X_text_test)

# === 🔢 Normalize amount column ===
scaler = StandardScaler()
X_amount_train_scaled = scaler.fit_transform(X_amount_train)
X_amount_test_scaled = scaler.transform(X_amount_test)

# === 🔗 Combine TF-IDF + Amount ===
X_train_combined = hstack([X_text_train_tfidf, X_amount_train_scaled])
X_test_combined = hstack([X_text_test_tfidf, X_amount_test_scaled])

# === 🤖 Train XGBoost Classifier ===
model = XGBClassifier(use_label_encoder=False, eval_metric='mlogloss', random_state=42)
model.fit(X_train_combined, y_train)

# === 📊 Evaluation ===
y_pred = model.predict(X_test_combined)
accuracy = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred, target_names=label_encoder.classes_)

print(f"✅ Accuracy: {accuracy:.4f}")
print("📋 Classification Report:\n", report)

# === 🔁 Preview decoded predictions ===
y_pred_str = label_encoder.inverse_transform(y_pred)
print("🔮 Predicted categories (first 5):", y_pred_str[:5])

# === 💾 Save all model artifacts ===
os.makedirs("model", exist_ok=True)
with open('model/xgb_model.pkl', 'wb') as f:
    pickle.dump(model, f)

with open('model/tfidf_vectorizer.pkl', 'wb') as f:
    pickle.dump(vectorizer, f)

with open('model/label_encoder.pkl', 'wb') as f:
    pickle.dump(label_encoder, f)

with open('model/amount_scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)

print("✅ Model, vectorizer, encoder, and scaler saved in 'model/' directory.")
