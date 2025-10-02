
from pymongo import MongoClient

def get_db_collection():
    try:
        client = MongoClient('mongodb://localhost:27017/')
        db = client['expense_tracker_db']
        collection = db['expenses']
        return collection
    except Exception as e:
        print(f"Could not connect to MongoDB: {e}")
        return None