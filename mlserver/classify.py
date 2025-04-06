import joblib

# Step 1: Load the saved model and vectorizer from mlserver
model = joblib.load('mlserver/urgency_model.pkl')
vectorizer = joblib.load('mlserver/tfidf_vectorizer.pkl')

# Step 2: Get user input
user_input = input("Enter crime additional information: ").strip()

if not user_input:
    user_input = "Missing Info"

# Step 3: Transform the input text using the loaded TF-IDF vectorizer
X_test_tfidf = vectorizer.transform([user_input])

# Step 4: Predict urgency category
predicted_category = model.predict(X_test_tfidf)[0]

# Step 5: Print the result
print(f"\nPredicted Urgency Category: {predicted_category}")
