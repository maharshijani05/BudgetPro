from pymongo import MongoClient
import pandas as pd
from dotenv import load_dotenv
import os
from bson import ObjectId

load_dotenv()
# Get the database URL from environment variable
database_url = os.getenv("DATABASE_URL")

# Connect to MongoDB
client = MongoClient(database_url)
db = client["test"]
transactions_col = db["transactions"]

# === 📥 Extract: Load data from MongoDB ===
transactions_df = pd.DataFrame(list(transactions_col.find()))

# === 🧹 Filter based on business logic for training set ===
filtered_df = transactions_df[
    transactions_df.apply(lambda row: str(row["userId"]) == row["sender_id"], axis=1)
].copy()

# === 🧱 Build Feature Table for Training (ML Input Table) ===
ml_features = filtered_df[["description", "debit", "category"]].rename(columns={
    "debit": "amount_inr"
})

# === 🟨 Create Fact Table (for future analytics/reporting use) ===
fact_transactions = filtered_df[[
    "_id", "userId", "accountId", "date", "description", "debit", "category"
]].rename(columns={
    "_id": "transaction_id",
    "userId": "user_id",
    "debit": "amount_inr"
})

# === 💾 Save Required CSVs ===
os.makedirs("warehouse", exist_ok=True)
ml_features.to_csv("warehouse/transaction_features.csv", index=False)
fact_transactions.to_csv("warehouse/fact_transactions.csv", index=False)

print("✅ ETL complete. Training and fact tables saved in 'warehouse/' folder.")
