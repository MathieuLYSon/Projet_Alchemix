#!/usr/bin/env python

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
    list_histo = cursor_histo.count()

    print(" ################### list_histo ################### ")
    print(list_histo)

    cursor_likes = collection_mongo_user_likes.find({}, {"user_id": 1})
    list_likes = cursor_likes.count()

    print(" ################### list_likes ################### ")
    print(list_likes)


    if (list_histo > 0 & list_likes > 0):
        return True
    
    else:
        return False