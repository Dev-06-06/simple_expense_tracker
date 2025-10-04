from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from db_mongo import get_db_collection
from bson import ObjectId # To handle MongoDB's _id
load_dotenv() # Loads variables from .env file
app = Flask(__name__)
CORS(app)
expenses_collection = get_db_collection()

# Endpoint to GET all expenses
@app.route("/api/expenses", methods=['GET'])
def get_expenses():
    expenses = []
    for expense in expenses_collection.find({}).sort("date", -1):
        expense['_id'] = str(expense['_id'])
        expenses.append(expense)
    return jsonify(expenses)

# Endpoint to POST a new expense
@app.route("/api/expenses", methods=['POST'])
def add_expense():
    data = request.get_json()
    new_expense = {
        "description": data['description'],
        "amount": float(data['amount']),
        "category": data['category'],
        "date": data['date']
    }
    result = expenses_collection.insert_one(new_expense)
    return jsonify({"message": "Expense added", "id": str(result.inserted_id)}), 201

if __name__ == "__main__":
    app.run(debug=True)