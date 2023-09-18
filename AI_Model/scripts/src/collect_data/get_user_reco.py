#!/usr/bin/env python
import os
import pickle
import pandas as pd
import bson

#__init__.py
# from src.data_processing.bson.objectid import ObjectId
from sklearn.metrics.pairwise import cosine_similarity
from src.collect_data.get_user_histo import get_user_histo
from src.collect_data.get_all_musics_to_df import get_all_musics
from src.collect_data.get_user_likes import get_user_liked_musics
from src.connections.mongo_connect import mongo_connect_to_collection
from src.data_processing.normalize_features import normalize_music_features_dataframe



# MongoDB Atlas
username_mongo = "AI_Model"
password = "iwQIkVn14ud7xBKP"
cluster_uri = "cluster0.kjfexm6.mongodb.net"
database_name = "mern"
collection_name = "recommended_musics"



def get_user_recommendations(user_matrix, model_path : str):

    '''
        Cette fonction prend la user_matrix et renvoie ses recommandations associées
        Paramètres :
            user_matrix : Dataframe pandas qui contient les données utilisateur à analyser
            model_path : chaine de caractère indiquant le chemin vers le modèle à utiliser
        Output : 
            Renvoie un dataframe contenant les recommandations pour l'utilisateur
    '''

    feature_columns = ["danceability", "energy", "duration_ms", "time_signature", 
                      "mode", "loudness", "speechiness", "acousticness",  "key", 
                      "instrumentalness", "valence", "tempo", "liveness"]

    print(" ################ DANS GET USER RECO ################ ")
    print(user_matrix)

    user_id = user_matrix["user_id"][0]
    print("################", user_id, "################ \n")
    # mongo_id = ObjectId(user_id)
    X_user = user_matrix.drop(columns="track_id")
    X_user = normalize_music_features_dataframe(X_user)

    # Ajoute un biais 
    X_user["user_id"] = 1
    X_user["biais"] = 1

    print("Chargement du modèle")
    
    print(os.getcwd())

    with open(model_path, "rb") as model_file:
        reco_model = pickle.load(model_file, encoding="latin1")
        # unpickle_steps = pickle._Unpickler(model_file)
        # unpickle_steps.encoding = 'latin1'
        # reco_model = unpickle_steps.load()

    print("Le modèle est chargé")

    # Retirer les musiques connues de l'utilisateur de all_musics
    all_musics = get_all_musics()
    user_histo = get_user_histo(user_id)
    user_likes = get_user_liked_musics(user_id)    
    histo_track_ids = user_histo["track_id"]
    likes_track_ids = user_likes["track_id"]

    collection_mongo_user_reco = mongo_connect_to_collection(username_mongo, password, cluster_uri, 
                                                                 database_name, collection_name)
    
    cursor = collection_mongo_user_reco.find({"user_id" : user_id}, {"track_id": 1})
    len_cur = list(cursor)

    # if len(len_cur) > 0:
    #     reco_id = pd.DataFrame(cursor)
    #     reco_ids = reco_id["user_id"]
    #     all_ids = pd.concat([histo_track_ids, likes_track_ids, reco_ids], axis=0)
    #     all_ids = all_ids.unique()

    # else:
    #     all_ids = pd.concat([histo_track_ids, likes_track_ids], axis=0)
    #     all_ids = all_ids.unique()

    all_ids = pd.concat([histo_track_ids, likes_track_ids], axis=0)
    all_ids = all_ids.unique()

    potential_reco = all_musics[~all_musics["track_id"].isin(all_ids)]

    predictions = reco_model.predict(X_user)
    similarity_scores = cosine_similarity(predictions, potential_reco[feature_columns])
    top_music_indices = similarity_scores.argsort()[0][::-1]
    recommended_music = potential_reco.iloc[top_music_indices][:35]

    # Ingestion des données dans Mongo

    track_info = all_musics[all_musics["track_id"].isin(recommended_music["track_id"])]

    print(" ################### TRACK INFO TYPE : ################### \n", type(track_info))
    print(track_info.columns)
    print(track_info)

    for index, row in track_info.iterrows():
        track_id = row["track_id"]
        danceability = row["danceability"]
        energy = row["energy"]
        key = row["key"]
        duration_ms = row["duration_ms"]
        time_signature = row["time_signature"]
        mode = row["mode"]
        loudness = row["loudness"]
        speechiness = row["speechiness"]
        acousticness = row["acousticness"]
        instrumentalness = row["instrumentalness"]
        valence = row["valence"]
        tempo = row["tempo"]
        liveness = row["liveness"]
        track_name = row["titre"]
        track_year = row["year"]
        main_artist = row["main_artist"]
        album_image = row["album_image"]
        album_name = row["album_name"]
        popularity = row["popularity"]

        dict_track = {
            "track_id" : track_id,
            "titre" : track_name,
            "year" : track_year,
            "artists" : main_artist,
            "user_id" : user_id,
            "album_name" : album_name,
            "album_image" : album_image,
            "popularity" : popularity,
            "danceability" : danceability,
            "energy" : energy,
            "key" : key,
            "duration_ms" : duration_ms,
            "time_signature" : time_signature,
            "mode" : mode,
            "loudness" : loudness,
            "speechiness" : speechiness,
            "acousticness" : acousticness,
            "instrumentalness" : instrumentalness,
            "valence" : valence,
            "tempo" : tempo,
            "liveness" : liveness,
            "note" : 0,
            "liked" : False
            }
        
        insert_result = collection_mongo_user_reco.insert_one(dict_track)

        if insert_result.acknowledged:
            print("Data inserted successfully.")

        else:
            print("Insertion failed.")

    return recommended_music