import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import MinMaxScaler, LabelEncoder
from sklearn.metrics import mean_squared_error
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import xgboost as xgb

# === 📂 Load dataset ===
df = pd.read_csv("warehouse/model3_budget_prediction_dataset.csv")

# === 📌 Define category mappings ===
categories = [
    "food", "transport", "shopping", "bills",
    "entertainment", "travel", "health", "education",
    "recharge", "other"
]

categories1 = [
    "Food and Dining", "Transportation", "Shopping", "Bills and Utilities",
    "Entertainment", "Travel", "Health", "Education",
    "Recharge and Subscriptions", "Others"
]

# === ✅ Define input and output columns ===
input_features = (
    ["income", "expense_to_income_ratio", "std_monthly_expense", "cluster_name"] +
    [f"{cat}" for cat in categories1]
)

output_targets = [f"{cat}_budget" for cat in categories] + ["savings_predicted"]

# === 🔄 Split dataset into train and test sets ===
X = df[input_features]
Y = df[output_targets]

X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=42)

# === 🏷️ Encode categorical features ===
categorical_cols = ["cluster_name"]

# Label encoding for categorical features
label_encoder = LabelEncoder()
X_train[categorical_cols] = X_train[categorical_cols].apply(label_encoder.fit_transform)
X_test[categorical_cols] = X_test[categorical_cols].apply(label_encoder.transform)

# === 🔄 Scale numerical features except for "expense_to_income_ratio" ===
scaler = MinMaxScaler()

# List of columns to scale
numerical_cols = [col for col in X.columns if col != "expense_to_income_ratio" and col != "cluster_name"]

# Apply MinMaxScaler to the numerical features
X_train[numerical_cols] = scaler.fit_transform(X_train[numerical_cols])
X_test[numerical_cols] = scaler.transform(X_test[numerical_cols])

# === 📊 Define the model pipeline ===
model = Pipeline(steps=[
    ("regressor", xgb.XGBRegressor(random_state=42, objective='reg:squarederror'))
])

# === 🛠️ Hyperparameter Tuning with GridSearchCV ===
param_grid = {
    "regressor__n_estimators": [100, 200],
    "regressor__learning_rate": [0.01, 0.1, 0.2],
    "regressor__max_depth": [3, 4, 5],
    "regressor__subsample": [0.8, 1.0],
    "regressor__colsample_bytree": [0.8, 1.0]
}

grid_search = GridSearchCV(estimator=model, param_grid=param_grid, cv=3, scoring='neg_mean_squared_error', n_jobs=-1)

# === 🔁 Train the model with hyperparameter tuning ===
grid_search.fit(X_train, Y_train)

# Best hyperparameters
best_params = grid_search.best_params_
print("Best Hyperparameters:", best_params)

# === 🔍 Make predictions using the best model ===
best_model = grid_search.best_estimator_

# Predict on the test set
predictions = best_model.predict(X_test)

# === 📊 Evaluate the model ===
mse = mean_squared_error(Y_test, predictions)
rmse = np.sqrt(mse)
print(f"✅ RMSE: {rmse:.2f}")

# === 💾 Save the trained model and metadata ===
# joblib.dump(best_model, 'ml/xgboost_budget_regression_model.pkl')
# joblib.dump(input_features, 'ml/input_features.pkl')
# joblib.dump(output_targets, 'ml/output_targets.pkl')
joblib.dump(scaler, 'ml/minmax_scaler_budget.pkl')
joblib.dump(label_encoder, 'ml/label_encoder_budget.pkl')


