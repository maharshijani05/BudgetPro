import joblib
import numpy as np

# Load saved models
scaler = joblib.load(r'E:\BudgetPro\ml\scaler.pkl')
kmeans = joblib.load(r'E:\BudgetPro\ml\kmeans_model.pkl')

# Define label mapping (must match the one used during training)
cluster_centers = kmeans.cluster_centers_[:, 0]
sorted_indices = np.argsort(cluster_centers)
labels_ordered = ['Saver', 'Balanced', 'Spender', 'Extreme Spender']
cluster_label_map = {sorted_indices[i]: labels_ordered[i] for i in range(len(labels_ordered))}

# Function to predict label for a given ratio
def predict_cluster_label(ratio):
    ratio_scaled = scaler.transform([[ratio]])
    cluster = kmeans.predict(ratio_scaled)[0]
    label = cluster_label_map[cluster]
    return label

# Example usage
new_ratio = 0.94  
predicted_label = predict_cluster_label(new_ratio)
print(f"Expense-to-Income Ratio: {new_ratio}")
print(f"Predicted Category: {predicted_label}")
