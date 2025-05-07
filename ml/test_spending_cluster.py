from spending_cluster_endpoint import predict_cluster_label

new_ratio = 0.83
predicted_label = predict_cluster_label(new_ratio)
print(f"Expense-to-Income Ratio: {new_ratio}")
print(f"Predicted Category: {predicted_label}")