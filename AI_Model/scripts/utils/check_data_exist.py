#!/usr/bin/env python
import pandas as pd

#__init__.py
from src.connections.mongo_connect import mongo_connect_to_collection



# MongoDB Atlas
username_mongo = "AI_Model"
password = "iwQIkVn14ud7xBKP"
cluster_uri = "cluster0.kjfexm6.mongodb.net"
database_name = "mern"
histo_collection = "user_histories"
likes_collection = "liked_musics"



def check_data_existance():

    collection_mongo_user_histo = mongo_connect_to_collection(username_mongo, password, cluster_uri, 
                                                              database_name, histo_collection)
    collection_mongo_user_likes = mongo_connect_to_collection(username_mongo, password, cluster_uri, 
                                                              database_name, likes_collection)
    
    cursor_histo = collection_mongo_user_histo.find({}, {"user_id": 1})
    list_histo = pd.Dataframe(cursor_histo)
    histo_count = len(list_histo)

    print(" ################### list_histo ################### ")
    print(histo_count)

    cursor_likes = collection_mongo_user_likes.find({}, {"user_id": 1})
    list_likes = pd.Dataframe(cursor_likes)
    likes_count = len(list_likes)

    print(" ################### list_likes ################### ")
    print(likes_count)


    if (histo_count > 0 & likes_count > 0):
        return True
    
    else:
        return False