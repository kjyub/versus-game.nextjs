from pymongo import MongoClient
import os, certifi
from datetime import datetime, timedelta

def connect():
    db_id = os.environ.get("DB_ID")
    db_password = os.environ.get("DB_PASSWORD")
    BASE_URL = "mongodb+srv://{}:{}@versusgamedev.tibkszx.mongodb.net/?retryWrites=true&w=majority&appName=VersusGameDev"
    url = BASE_URL.format(db_id, db_password)

    client = MongoClient(url, tlsCAFile=certifi.where())

    return client

def insert_game(datas):
    # print(datas)
    client = connect()
    # print("client", client)
    db = client["release"]
    collection = db["versus_games"]

    start_of_day = datetime.combine(datetime.today(), datetime.min.time())
    start_of_day = start_of_day - timedelta(days=1)
    end_of_day = start_of_day + timedelta(days=2)
    delete_filter = {
        "created_at": {'$exists': False}
    }

    delete_result = collection.delete_many(delete_filter)
    print(delete_result)

    result = collection.insert_many(datas)
    print(result)

    # result = collection.update_many(
    #     {"userId": {"$exists": False}},
    #     {"$set": {
    #         "createdAt": datetime.now(),
    #         "updatedAt": datetime.now(),
    #         "userId": "66659f346da52938c4ce47ed",
    #     }}
    # )
    # print(result)

    client.close()