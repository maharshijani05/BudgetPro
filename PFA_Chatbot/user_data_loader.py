from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

def fetch_user_data(user_id: str):
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client["test"]
    collection = db["transactions"]

    user_data = collection.find({"userId": user_id})
    combined_text = ""

    for record in user_data:
        monthly_summary = f"""
        Month: {record.get('month')}
        Income: ₹{record.get('income')}
        Expenses: ₹{record.get('expenses')}
        Category Breakdown:
        """
        for category, amount in record.get("categories", {}).items():
            monthly_summary += f"- {category}: ₹{amount}\n"
        combined_text += monthly_summary + "\n"

    return combined_text.strip()
