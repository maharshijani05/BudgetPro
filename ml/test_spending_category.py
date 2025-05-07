from spending_category_endpoint import predict_category

desc = "Dominos Pizza"
amount = 599.00

category = predict_category(desc, amount)
print(f"Predicted Category: {category}")
