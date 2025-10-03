import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from urllib.parse import quote_plus # This is for securely encoding the password

def get_db_collection():
    """
    Establishes a connection to MongoDB Atlas by securely encoding the
    password and inserting it into the connection string.
    """
    # Load the connection string template and the password from environment variables
    mongo_uri_template = os.environ.get("MONGO_URI")
    password = os.environ.get("MONGO_PASS")

    if not mongo_uri_template or not password:
        print("ERROR: Missing MongoDB environment variables (MONGO_URI or MONGO_PASS).")
        print("Please check your .env file in the project root.")
        return None

    try:
        # Securely encode the password to handle any special characters
        encoded_password = quote_plus(password)
        
        # Replace the <password> placeholder with the securely encoded password
        connection_string = mongo_uri_template.replace("<password>", encoded_password)

        client = MongoClient(connection_string)
        
        # Ping the server to confirm a successful connection
        client.admin.command('ping')
        print("✅ Successfully connected to MongoDB Atlas!")
        
        db = client['expense_tracker_db']
        collection = db['expenses']
        return collection
    except ConnectionFailure as e:
        print(f"❌ Could not connect to MongoDB Atlas: {e}")
        return None
    except Exception as e:
        print(f"❌ An unexpected error occurred: {e}")
        return None

