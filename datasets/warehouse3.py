import pandas as pd
import numpy as np
from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv
import os

# === 📂 Load user cluster data ===
cluster_df = pd.read_csv(r"E:\BudgetPro\datasets\user_cluster_summary.csv")[
    ['user_id', 'income', 'expense_to_income_ratio', 'cluster_name']
]

load_dotenv()
database_url = os.getenv("DATABASE_URL")

# === 🔌 Connect to MongoDB ===
client = MongoClient(database_url)
db = client['test']  # Replace with your actual DB name
raw_transactions = list(db.transactions.find())
raw_budgets = list(db.budgets.find())

# === 🧹 Filter valid transactions (sender_id == userId) ===
filtered_transactions = [
    txn for txn in raw_transactions
    if str(txn.get("userId")) == txn.get("sender_id")
]
transactions = pd.DataFrame(filtered_transactions)
budgets = pd.DataFrame(raw_budgets)

# === 🧹 Preprocess transactions ===
transactions['date'] = pd.to_datetime(transactions['date'])
transactions['month'] = transactions['date'].dt.to_period('M')
category_map = {
    "foodAndDining": "food_avg",
    "transportation": "transport_avg",
    "shopping": "shopping_avg",
    "billsAndUtilities": "bills_avg",
    "entertainment": "entertainment_avg",
    "travel": "travel_avg",
    "health": "health_avg",
    "education": "education_avg",
    "rechargeAndSubscriptions": "recharge_avg",
    "others": "other_avg"
}

# === 🧮 Monthly expense per user per category ===
monthly_expense = transactions.groupby(['userId', 'month', 'category'])['debit'].sum().reset_index()

# === 🧮 Average monthly expense per category ===
avg_expense = monthly_expense.groupby(['userId', 'category'])['debit'].mean().unstack(fill_value=0).reset_index()
avg_expense.rename(columns=category_map, inplace=True)

# === 🧮 Standard deviation of total monthly expenses ===
monthly_total = monthly_expense.groupby(['userId', 'month'])['debit'].sum().reset_index()
std_dev_expense = monthly_total.groupby('userId')['debit'].std().reset_index()
std_dev_expense.columns = ['userId', 'std_monthly_expense']

# === 🧹 Budget preprocessing ===
budget_map = {
    "foodAndDining": "food_budget",
    "transportation": "transport_budget",
    "shopping": "shopping_budget",
    "billsAndUtilities": "bills_budget",
    "entertainment": "entertainment_budget",
    "travel": "travel_budget",
    "health": "health_budget",
    "education": "education_budget",
    "rechargeAndSubscriptions": "recharge_budget",
    "others": "other_budget",
    "saving": "savings_predicted"
}

budget_columns = list(budget_map.keys())
budget_df = budgets[['userId'] + budget_columns].copy()
budget_df = budget_df.groupby('userId', as_index=False).mean()
budget_df.rename(columns=budget_map, inplace=True)

# === 🧹 Standardize user ID column names ===
avg_expense.rename(columns={"userId": "user_id"}, inplace=True)
std_dev_expense.rename(columns={"userId": "user_id"}, inplace=True)
budget_df.rename(columns={"userId": "user_id"}, inplace=True)

# Ensure user_id fields are strings for consistent merging
cluster_df['user_id'] = cluster_df['user_id'].astype(str)
avg_expense['user_id'] = avg_expense['user_id'].astype(str)
std_dev_expense['user_id'] = std_dev_expense['user_id'].astype(str)
budget_df['user_id'] = budget_df['user_id'].astype(str)


# === 🔗 Merge all dataframes ===
merged_df = cluster_df.merge(avg_expense, on="user_id", how="inner")
merged_df = merged_df.merge(std_dev_expense, on="user_id", how="left")
merged_df = merged_df.merge(budget_df, on="user_id", how="inner")

# === 💾 Save to CSV ===
os.makedirs("warehouse", exist_ok=True)
merged_df.to_csv("warehouse/model3_budget_prediction_dataset.csv", index=False)
print("✅ Model 3 dataset created: warehouse/model3_budget_prediction_dataset.csv")
