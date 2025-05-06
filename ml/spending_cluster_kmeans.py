import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import silhouette_score
import joblib

# Load the prepared user summary data
summary_df = pd.read_csv(r"E:\BudgetPro\datasets\user_expense_summary.csv")

# Keep relevant columns
user_summary = summary_df[["user_id", "expense_to_income_ratio", "income"]].copy()

# Normalize only the expense_to_income_ratio
scaler = StandardScaler()
X_scaled = scaler.fit_transform(user_summary[["expense_to_income_ratio"]])

# Apply KMeans with fixed 4 clusters
kmeans_final = KMeans(n_clusters=4, random_state=42, n_init=10)
user_summary['cluster'] = kmeans_final.fit_predict(X_scaled)

# Assign fixed labels to sorted cluster centroids
ratios = kmeans_final.cluster_centers_[:, 0]
sorted_indices = np.argsort(ratios)
labels_ordered = ['Saver', 'Balanced', 'Spender', 'Extreme Spender']
cluster_label_map = {sorted_indices[i]: labels_ordered[i] for i in range(4)}
user_summary['cluster_name'] = user_summary['cluster'].map(cluster_label_map)

user_summary = user_summary.sort_values("user_id").reset_index(drop=True)
user_summary["user_label"] = ["User " + str(i+1) for i in range(len(user_summary))]

# Scatter plot with serial number instead of user_id
plt.figure(figsize=(12, 6))
sns.scatterplot(
    data=user_summary,
    x='user_label',
    y='expense_to_income_ratio',
    hue='cluster_name',
    palette='Set2',
    s=100
)
plt.title('User Clusters Based on Expense-to-Income Ratio')
plt.xlabel('User')
plt.ylabel('Expense to Income Ratio')
plt.xticks(rotation=90)
plt.grid(True)
plt.tight_layout()
plt.show()

# Cluster distribution
print("Cluster Distribution:")
print(user_summary['cluster_name'].value_counts())

# Silhouette score
sil_score = silhouette_score(X_scaled, user_summary['cluster'])
print(f"Silhouette Score (k=4): {sil_score:.4f}")

# Cluster number to label mapping
print("\nCluster Number to Label Mapping:")
for cluster_id, label in cluster_label_map.items():
    print(f"Cluster {cluster_id} -> {label}")

# Save results
user_summary.to_csv("user_cluster_summary.csv", index=False)
joblib.dump(kmeans_final, "kmeans_model.pkl")
joblib.dump(scaler, "scaler.pkl")

print("✅ Clustering completed and saved.")
