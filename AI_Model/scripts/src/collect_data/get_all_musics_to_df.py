#!/usr/bin/env python
import pandas as pd

# __init__.py
from src.connections.mongo_connect import mongo_connect_to_collection



# Mongo Atlas
username = "AI_Model"
password = "iwQIkVn14ud7xBKP"
cluster_uri = "cluster0.kjfexm6.mongodb.net"
database_name = "mern"
collection_name = "all_musics"



def get_all_musics():

    collection_mongo_all_musics = mongo_connect_to_collection(username, password, cluster_uri, 
                                                              database_name, collection_name)

    projection = {
        "track_id": 1,
        "titre": 1,
        "year": 1,
        "artists.main_artist": 1,
        "artists.featurings": 1,
        "artists.artist_genre": 1,
        "album.album_name": 1,
        "album.album_image": 1,
        "album.all_musics":1,
        "features": 1,
        "_id": 0
    }

    cursor = collection_mongo_all_musics.find({}, projection)
    df = pd.DataFrame(cursor)
    df["main_artist"] = df["artists"].apply(lambda x: x.get("main_artist", None))
    df["featurings"] = df["artists"].apply(lambda x: x.get("featurings", None))
    df["artist_genre"] = df["artists"].apply(lambda x: x.get("artist_genre", None))
    df["album_name"] = df["album"].apply(lambda x: x.get("album_name", None))
    df["album_image"] = df["album"].apply(lambda x: x.get("album_image", None))
    df = pd.concat([df.drop(["features"], axis=1), df["features"].apply(pd.Series)], axis=1)
    df.drop(columns=["artists", "album"], inplace=True)

    return df