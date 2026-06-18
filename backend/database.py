from pymongo import MongoClient

MONGO_URL = "mongodb://localhost:27017"

client = MongoClient(MONGO_URL)
db = client["attendance_db"]

students_col = db["students_record"]
attendance_col = db["attendance"]
