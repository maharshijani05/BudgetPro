import pandas as pd
import joblib
import requests
from io import BytesIO

# === Hugging Face URLs (Update with correct repo if needed) ===
HF_BASE = "https://huggingface.co/maharshijani05/budget_model/resolve/main/"
MODEL_URL = HF_BASE + "xgboost_budget_regression_model.pkl"
SCALER_URL = HF_BASE + "minmax_scaler_budget.pkl"
ENCODER_URL = HF_BASE + "label_encoder_budget.pkl"

# === 📦 Load objects directly from Hugging Face ===
def load_joblib_from_url(url):
    response = requests.get(url)
    response.raise_for_status()
    return joblib.load(BytesIO(response.content))

# === 🔮 Budget Prediction Function ===
def predict_budget_allocation(user_input_dict):
    # Load model, scaler, encoder
    model = load_joblib_from_url(MODEL_URL)
    scaler = load_joblib_from_url(SCALER_URL)
    label_encoder = load_joblib_from_url(ENCODER_URL)

    # Convert input to DataFrame
    df = pd.DataFrame([user_input_dict])

    # Encode categorical feature
    df["cluster_name"] = label_encoder.transform(df["cluster_name"])

    # Scale numerical features (excluding cluster_name and ratio)
    numerical_cols = [col for col in df.columns if col not in ["expense_to_income_ratio", "cluster_name"]]
    df[numerical_cols] = scaler.transform(df[numerical_cols])

    # Predict
    predictions = model.predict(df)

    # Output DataFrame
    output_columns = [
        "food_budget", "transport_budget", "shopping_budget", "bills_budget",
        "entertainment_budget", "travel_budget", "health_budget", "education_budget",
        "recharge_budget", "other_budget", "savings_predicted"
    ]
    return pd.DataFrame(predictions, columns=output_columns)
