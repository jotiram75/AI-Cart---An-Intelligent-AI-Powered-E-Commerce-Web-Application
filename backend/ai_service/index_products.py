import os
import sys
import requests
import json
from pymongo import MongoClient
from pymongo.errors import ConfigurationError
from model import FeatureExtractor
from vector_db import VectorDB
from dotenv import load_dotenv
import tempfile
from PIL import Image
from io import BytesIO

load_dotenv(dotenv_path="../.env")

# MongoDB Configuration
MONGO_URI = os.getenv("MONGODB_URL") # Noted: .env uses MONGODB_URL
client = MongoClient(MONGO_URI)
try:
    db_mongo = client.get_database() 
except (ConfigurationError, Exception):
    # Fallback to 'test' if no default database is defined in URI
    db_mongo = client["test"]
    print("DEBUG: No default database in URI, falling back to 'test'", file=sys.stderr)

products_col = db_mongo["products"]

extractor = FeatureExtractor()
vector_db = VectorDB()

def index_all_products():
    print("Fetching products from MongoDB...")
    products = list(products_col.find({}))
    print(f"Found {len(products)} products.")
    
    vector_db.clear()
    
    for product in products:
        product_id = str(product["_id"])
        image_url = product.get("image1")
        
        if not image_url:
            print(f"Skipping product {product_id}: No image1")
            continue
            
        print(f"Processing product {product_id} ({product.get('name')})...")
        try:
            response = requests.get(image_url)
            if response.status_code == 200:
                with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
                    tmp.write(response.content)
                    tmp_path = tmp.name
                
                features = extractor.extract(tmp_path)
                vector_db.add_vectors([features], [product_id])
                
                os.unlink(tmp_path)
            else:
                print(f"Failed to download image for {product_id}: {response.status_code}")
        except Exception as e:
            print(f"Error processing product {product_id}: {e}")

    print("Indexing complete.")

if __name__ == "__main__":
    index_all_products()
