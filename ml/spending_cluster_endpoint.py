import joblib
import numpy as np
import requests
from io import BytesIO

# Direct URLs to Hugging Face model files
SCALER_URL = "https://huggingface.co/maharshijani05/spending_cluster_kmeans/resolve/main/scaler.pkl"
MODEL_URL = "https://huggingface.co/maharshijani05/spending_cluster_kmeans/resolve/main/kmeans_model.pkl"

# === 📦 Load Hugging Face Artifacts from URL ===
def load_joblib_from_url(url):
    response = requests.get(url)
    response.raise_for_status()
    return joblib.load(BytesIO(response.content))

# === 🔮 Prediction Function ===
def predict_cluster_label(ratio):
    # Load model and scaler in memory from Hugging Face
    scaler = load_joblib_from_url(SCALER_URL)
    kmeans = load_joblib_from_url(MODEL_URL)

    # Define label mapping based on cluster centers
    cluster_centers = kmeans.cluster_centers_[:, 0]
    sorted_indices = np.argsort(cluster_centers)
    labels_ordered = ['Saver', 'Balanced', 'Spender', 'Extreme Spender']
    cluster_label_map = {sorted_indices[i]: labels_ordered[i] for i in range(len(labels_ordered))}

    # Predict label
    ratio_scaled = scaler.transform([[ratio]])
    cluster = kmeans.predict(ratio_scaled)[0]
    label = cluster_label_map[cluster]
    return label
