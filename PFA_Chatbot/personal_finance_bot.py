import os
import pandas as pd
from dotenv import load_dotenv
from pymongo import MongoClient
from langchain_groq import ChatGroq
from bson import ObjectId
import re

def run_chatbot(user_id):
    # Load environment variables
    load_dotenv()
    groq_api_key = os.getenv("GROQ_API_KEY")
    db_url = os.getenv("MONGO_URI")

    # Initialize MongoDB connection
    client = MongoClient(db_url)
    db = client["test"]
    transactions_col = db["transactions"]
    users_col = db["users"]

    # Load data for the user
    user_profile = users_col.find_one({"_id": ObjectId(user_id)})
    if not user_profile:
        raise ValueError(f"No user found with user_id {user_id}")

    user_name = user_profile.get("name", "User")
    transactions = list(transactions_col.find({"userId": ObjectId(user_id)}))

    if not transactions:
        raise ValueError("No transactions found for the user")

    # Convert to DataFrame
    df = pd.DataFrame(transactions)
    # print("\n[DEBUG] Columns in df:", df.columns.tolist())
    df['date'] = pd.to_datetime(df['date'])
    df['month'] = df['date'].dt.strftime('%B %Y')
    # print("\n[DEBUG]", df['month'].head())

    # Add metadata for better query understanding (optional)
    df['is_expense'] = df['debit'].notnull()  # True if debit column has a value
    df['is_income'] = df['credit'].notnull()  # True if credit column has a value

    # Initialize LLM
    llm = ChatGroq(groq_api_key=groq_api_key, model="gemma2-9b-it")

    # System prompt with detailed information about financial semantics
    system_prompt = f"""
    You are a helpful financial assistant for a personal finance app. 
    Use the following instructions to answer the user's finance-related questions accurately.

    User name: {user_name}

    **Data Context:**

    - Use the following pandas DataFrame 'df' that contains the user's transaction data.
    - Column meanings:
    - 'debit': The amount spent by the user in INR for an expense transaction (null if income).
    - 'credit': The amount received by the user in INR (income; null if expense).
    - 'balance': The account balance after the transaction.
    - 'type': The mode of payment (e.g., "net banking", "UPI", "credit card", "debit card", "cash", "wallet").
    - 'category': The category of the transaction (e.g., "Food and Dining", "Transportation","Shopping","Bills and Utilities", "Entertainment", "Travel", "Health", "Education", "Recharge and Subscriptions", "Others", "NA").
    - 'date': Date of the transaction.
    - 'month': A string in the format "MonthName Year" (e.g., "February 2025") derived from the 'date' field.
    
    **User Profile Context:**

    - user_profile contains the user's personal data such as:
    - 'income': Total monthly income.
    - 'Savings': Current savings.
    - 'save_per': The percentage of income the user saves (e.g., 10%).
    - 'email': User's email.
    - 'name': Name of the user.

    **Rules:**

    - If a question relates to expenses, sum the 'debit' column for the relevant category or date range.
    - If a question is related to yearly income, multiply the monthly income by 12.
    - If a question is related to expense do not include the rows where category is "NA".
    - Use 'category' for filtering specific transaction types (e.g., "Transportation", "Food and Dining", etc.).
    - If a user asks about a specific month, match it using the 'month' column in format "MonthName Year" (e.g., "February 2025").
    - Use user_profile to answer questions about income, email, name, savings, etc.
    - If the user asks for a specific transaction, filter the DataFrame based on the user's input.
    - If the user asks for a summary, provide a summary of the relevant transactions.
    - If the user asks for expenses or income, use ₹ to denote the currency.
    - If something isn't available, say so by setting: 
    answer = "Sorry, I couldn't find that information."
    - Return only executable Python code that sets a variable 'answer' with the final string result.
    - Do NOT return anything except the code.
    """

    print(f"👋 Hello {user_name}, I'm your Personal Finance Assistant! Ask me anything about your finances.\n")

    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit","bye"]:
            print("Bot: 👋 Adios Amigo!")
            break

        try:
            # Compose the final prompt for LLM
            prompt = system_prompt + f"\n\nUser question: {user_input}\n"

            # Invoke LLM
            response = llm.invoke(prompt)
            raw_code = response.content.strip() if hasattr(response, "content") else str(response)

            # Clean code block: remove backticks and language labels
            code = re.sub(r"^```(?:python)?|```$", "", raw_code.strip(), flags=re.MULTILINE).strip()

            # print("\n[DEBUG] Cleaned Code to Execute:\n", code, "\n")

            # Execute the cleaned code
            local_vars = {
                "df": df.copy(),
                "user_profile": user_profile.copy(),
                "pd": pd 
            }
            exec(code, {}, local_vars)

            answer = local_vars.get("answer", "Sorry, I couldn't generate an answer.")
            print(f"Bot: {answer}\n")

        except Exception as e:
            print(f"Bot: Sorry, I encountered an error: {e}\n")