# file: budget_api.py
from flask import Flask, request, jsonify
import joblib
import requests
from io import BytesIO
import pandas as pd
from flask_cors import CORS

# from faq_chatbot import predict_budget_allocation

app = Flask(__name__)
CORS(app)


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
@app.route('/predict-budget', methods=['POST'])
def predict_budget():
    print("data",request.get_json())
    model = load_joblib_from_url(MODEL_URL)
    scaler = load_joblib_from_url(SCALER_URL)
    label_encoder = load_joblib_from_url(ENCODER_URL)
    data = request.get_json()
    df = pd.DataFrame([data])
    df["cluster_name"] = label_encoder.transform(df["cluster_name"])
    numerical_cols = [col for col in df.columns if col not in ["expense_to_income_ratio", "cluster_name"]]
    df[numerical_cols] = scaler.transform(df[numerical_cols])
    prediction =model.predict(df)
    print(prediction)
       # Define keys
    columns = [
        "foodAndDining", "transportation", "shopping", "billsAndUtilities",
        "entertainment", "travel", "health", "education",
        "rechargeAndSubscriptions", "others", "savings"
    ]

    # Zip and return
    return jsonify({key: float(value) for key, value in zip(columns, prediction[0])})




if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001)

