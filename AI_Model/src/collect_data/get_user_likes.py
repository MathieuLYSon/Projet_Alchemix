#!/usr/bin/env python
import pandas as pd
from bson.objectid import ObjectId

# __init__.py
from src.connections.mongo_connect import mongo_connect_to_collection


# Mongo Atlas
username = "AI_Model"
password = "iwQIkVn14ud7xBKP"
cluster_uri = "cluster0.kjfexm6.mongodb.net"
database_name = "mern"
collection_name = "liked_musics"



def get_user_liked_musics(user_id: str):

    collection_mongo_liked_musics = mongo_connect_to_collection(username, password, cluster_uri, 
                                                                database_name, collection_name)

    projection = {
        "added_at": 1,
        "track_id": 1,
        "liked_musics": 1,
        "artists": 1,
        "album_name": 1,
        "album_image": 1,
        "year": 1,
        "popularity": 1,
        "danceability": 1,
        "energy": 1,
        "key": 1,
        "duration_ms": 1,
        "time_signature": 1,
        "mode": 1, 
        "loudness": 1,
        "speechiness": 1,
        "acousticness": 1,
        "instrumentalness": 1,
        "valence": 1,
        "tempo": 1,
        "liveness": 1,
        "liked": 1,
        "user_id": 1,
        "note": 1
    }

    mongo_id = ObjectId(user_id)
    cursor = collection_mongo_liked_musics.find({"user_id": mongo_id}, projection)
    df = pd.DataFrame(cursor)

    return df