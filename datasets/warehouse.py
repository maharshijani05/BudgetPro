from pymongo import MongoClient
import pandas as pd

#Connect to MongoDB
client = MongoClient("mongodb+srv://patelaarya1402:Aarya%401402@cluster0.65qiy19.mongodb.net/")
db = client["test"]

#Load collections
users_col = db["users"]
transactions_col = db["transactions"]

#Load data into DataFrames
users_df = pd.DataFrame(list(users_col.find()))
transactions_df = pd.DataFrame(list(transactions_col.find()))

#Convert 'date' to datetime
if "date" in transactions_df.columns:
    transactions_df["date"] = pd.to_datetime(transactions_df["date"])
else:
    raise KeyError("The 'date' column is missing in transactions.")

if "debit" not in transactions_df.columns:
    raise KeyError("The 'debit' column is missing in transactions.")

#Create 'month' column
transactions_df["month"] = transactions_df["date"].dt.to_period("M")

#Calculate total debit per user
total_debit = transactions_df.groupby("userId")["debit"].sum().reset_index()
total_debit.columns = ["user_id", "total_debit"]

#Calculate number of unique months per user
month_count = transactions_df.groupby("userId")["month"].nunique().reset_index()
month_count.columns = ["user_id", "month_count"]

#Merge total_debit with month_count
total_debit = pd.merge(total_debit, month_count, on="user_id", how="inner")

#Calculate avg monthly expense = total debit / number of months
total_debit["avg_monthly_expense"] = total_debit["total_debit"] / total_debit["month_count"]
total_debit["user_id"] = total_debit["user_id"].astype(str)

#Prepare income data
if "income" not in users_df.columns:
    raise KeyError("'income' field not found in users collection.")

income_df = users_df[["_id", "income"]].copy()
income_df["user_id"] = income_df["_id"].astype(str)
income_df.drop(columns=["_id"], inplace=True)

#Merge expenses with income
summary_df = pd.merge(total_debit[["user_id", "avg_monthly_expense"]], income_df, on="user_id", how="inner")

#Calculate expense-to-income ratio
summary_df["expense_to_income_ratio"] = summary_df["avg_monthly_expense"] / summary_df["income"]

#Save to CSV
summary_df.to_csv("user_expense_summary.csv", index=False)
print("CSV file 'user_expense_summary.csv' has been saved successfully.")
