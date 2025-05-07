from budget_model_endpoint import predict_budget_allocation

# Sample test input
user_input = {
    "income": 50000,
    "expense_to_income_ratio": 0.95,
    "std_monthly_expense": 2000,
    "cluster_name": "Extreme Spender",
    "Food and Dining": 3000,
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

# Predict
result = predict_budget_allocation(user_input)
print(result)
