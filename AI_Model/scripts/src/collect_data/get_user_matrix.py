#!/usr/bin/env python
import pandas as pd



def get_user_matrix(user_hito, user_likes):

    '''
        Cette fonction génère la matrice utilisateur à analyser
        Paramètres :
            user_histo : le dataframe de l'historique de l'utilisateur
            user_likes : le dataframes des titres aimés par l'utilisateur
        Output : 
            Dataframe correspond à la matrice de l'utilisateur étudié
    '''

    histo_columns = ["track_id", "danceability", "energy", "duration_ms", 
                      "time_signature", "mode", "loudness", "speechiness", 
                      "acousticness", "instrumentalness", "valence", "tempo", 
                      "liveness", "user_id", "key"]
    
    matrix_columns = ["track_id", "danceability", "energy", "duration_ms", 
                      "time_signature", "mode", "loudness", "speechiness", 
                      "acousticness", "instrumentalness", "valence", "tempo", 
                      "liveness", "user_id", "key", "liked"]
    
    # On pourra ajouter la colonne "note" quand on aura plus de notes
    # On que l'on aura entrainer notre modèle avec cette colonne en plus
    liked_columns = ["liked", "track_id"]
    
    user_likes_df = user_likes

    user_liked_musics = user_likes_df[liked_columns]
    user_histo = user_hito[histo_columns]
    
    user_matrix = pd.merge(user_histo, user_liked_musics, on="track_id", how="inner")
    user_matrix["liked"].fillna(False, inplace=True)

    user_matrix["liked"] = user_matrix["liked"].apply(lambda x: 0 if x == False else 1)
    user_matrix.dropna(inplace=True)

    if len(user_matrix) < 100:
        number_add_tracks = 100 - len(user_matrix)
        add_tracks_df = user_likes_df[matrix_columns].iloc[:number_add_tracks]
        user_matrix = pd.concat([user_matrix, add_tracks_df], axis=0)
        user_matrix.reset_index(inplace=True)
        user_matrix.drop(columns="index", inplace=True)
    else:
        pass

    return user_matrix