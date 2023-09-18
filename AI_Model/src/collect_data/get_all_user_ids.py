#!/usr/bin/env python
import pandas as pd
# __init__.py
from src.connections.mongo_connect import mongo_connect_to_collection

# MongoDB Atlas
username_mongo = "AI_Model"
password = "iwQIkVn14ud7xBKP"
cluster_uri = "cluster0.kjfexm6.mongodb.net"
database_name = "mern"
histo_collection = "user_histories"
likes_collection = "liked_musics"



def get_all_user_ids():
    '''
        Cette fonction renvoie la liste de tout les utilisateurs ayant synchronisé leurs données Spotify
    '''

    # Collecte des Ids
    collection_mongo_user_histo = mongo_connect_to_collection(username_mongo, password, cluster_uri, 
                                                              database_name, histo_collection)
    collection_mongo_user_likes = mongo_connect_to_collection(username_mongo, password, cluster_uri, 
                                                              database_name, likes_collection)
    
    cursor_histo = collection_mongo_user_histo.find({}, {"user_id": 1})
    histo_ids = pd.DataFrame(cursor_histo)
    histo_id = histo_ids["user_id"]
    cursor = likes_collection.find({}, {"user_id": 1})
    like_ids = pd.DataFrame(cursor)
    like_id = like_ids["user_id"]
    all_ids = pd.concat([histo_id, like_id], axis=0)

    user_histo_ids = all_ids.unique()

    return user_histo_ids