#!/usr/bin/env python
import sys
import pandas as pd
# from bson import ObjectId

#__init__.py
# from src.data_processing.bson.objectid import ObjectId
from src.connections.mongo_connect import mongo_connect_to_collection



# Mongo Atlas
username = "AI_Model"
password = "iwQIkVn14ud7xBKP"
cluster_uri = "cluster0.kjfexm6.mongodb.net"
database_name = "mern"
collection_name = "user_histories"



def get_user_histo(user_id: str):

    collection_mongo_user_histories = mongo_connect_to_collection(username, password, cluster_uri, 
                                                                  database_name, collection_name)

    projection = {
        "_id": 0,
        "pull_timestamp": 1,
        "user_id": 1,
        "musics": 1,
        "__v": 1
    }

    # mongo_id = ObjectId(user_id)
    cursor = collection_mongo_user_histories.find({"user_id": user_id}, projection)
    df = pd.DataFrame(cursor)

    print(" ################### MUSICS_INFO ################### \n")
    print(df.columns)
    print(df)

    musics_info = df["musics"][0]
    df_musics = pd.DataFrame(musics_info)
    df_musics = df_musics.T
    df_musics["pull_timestamp"] = df["pull_timestamp"][0]
    df_musics["user_id"] = df["user_id"][0]
    df_musics["__v"] = df["__v"][0]

    print(" ################### DF_MUSICS ################### \n")
    print(df_musics.columns)
    print(df_musics)

    return df_musics



def main(arg):
    
    if len(arg) == 2:
        print(arg[1])
        user_id = arg[1]
        user_histo_df = get_user_histo(user_id)

    else:
        print("Mauvaise entrée il faut renseigner l'identifiant de l'utilisateur")
    
    return user_histo_df



if __name__ == "__main__":
    main(sys.argv)