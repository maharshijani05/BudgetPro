import pandas as pd
import joblib
from sklearn.preprocessing import MinMaxScaler, LabelEncoder

# === Load the trained model ===
model = joblib.load("ml/xgboost_budget_regression_model.pkl")

# === Load saved scalers and label encoder ===
scaler = joblib.load("ml/minmax_scaler_budget.pkl")  # Path to the scaler file
label_encoder = joblib.load("ml/label_encoder_budget.pkl")  # Path to the label encoder file

# === Sample test input data ===
test_input = {
    "income": 500000,
    "expense_to_income_ratio": 0.95,
    "std_monthly_expense": 2000,
    "cluster_name": "Balanced",  # Ensure this is a valid label
    "Food and Dining": 300000,
    "Transportation": 1500,
    "Shopping": 2000,
    "Bills and Utilities": 5500,
    "Entertainment": 1000,
    "Travel": 1200,
    "Health": 800,
    "Education": 1500,
    "Recharge and Subscriptions": 500,
    "Others": 600
}

# === Convert test input into DataFrame ===
test_input_df = pd.DataFrame([test_input])

# === Label encode the categorical column (cluster_name) ===
test_input_df["cluster_name"] = label_encoder.transform(test_input_df["cluster_name"])

# === Scale the numerical columns ===
numerical_cols = [col for col in test_input_df.columns if col not in ["expense_to_income_ratio", "cluster_name"]]
test_input_df[numerical_cols] = scaler.transform(test_input_df[numerical_cols])

# === Make predictions using the trained model ===
predictions = model.predict(test_input_df)

# === Display the predicted budgets and savings ===
predicted_budgets = pd.DataFrame(predictions, columns=[
    "food_budget", "transport_budget", "shopping_budget", "bills_budget", 
    "entertainment_budget", "travel_budget", "health_budget", "education_budget", 
    "recharge_budget", "other_budget", "savings_predicted"
])

print("Predicted Budget Categories and Savings for the Test Input:")
print(predicted_budgets)
