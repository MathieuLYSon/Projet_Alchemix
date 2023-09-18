#!/usr/bin/env python
import sys
import re
import time

# __init__.py
from src.connections.spotify_connect import con_spotify_api
from src.connections.mongo_connect import mongo_connect_to_collection



# Spotify
cid ="60d898c77e92460b8988529b4d3207c4"
secret = "ea177528ae92405cbeb3a38dd259407b"
username_spotify = "Lilbskit"
scope = "user-library-read playlist-modify-public playlist-read-private"
uri_redirect="http://localhost:3000/"



# MongoDB Atlas
username_mongo = "AI_Model"
password = "iwQIkVn14ud7xBKP"
cluster_uri = "cluster0.kjfexm6.mongodb.net"
database_name = "mern"
collection_name = "all_musics"



# Récupère la liste des tracks d'une playlist grâce à son url
def get_all_playlist_tracks(playlist_url):

    offset = 0
    all_tracks = []
    sp = con_spotify_api(cid, secret, username_spotify, scope, uri_redirect)

    while True:
        results = sp.playlist_tracks(playlist_url, offset=offset)
        tracks = results.get("items", [])

        if not tracks:
            break

        all_tracks.extend(tracks)
        offset += len(tracks)

    return all_tracks



# A partir d'un fichier texte, renvoie une liste
# Chaque élément de la liste contient une ligne du document texte
def read_file_to_list(file_path):

    try:
        with open(file_path, "r") as file:
            list_playlists = []
            lines = file.readlines()

            for line in lines:
              link = line.split("\n", 1)[0]
              list_playlists.append(link)

        return list_playlists
    
    except FileNotFoundError:
        return []
    


def insert_playlists_to_mongo(playlists_urls):

    '''
        Cette fonction prend en entrée une liste d'urls de playlists
        Pour cela nous stockons les urls des playlists dans des fichiers textes
        Puis nous utilisons notre fonction read_file_to_list() pour obtenir les urls à ajouter en base
    '''

    last_time = time.time()

    sp = con_spotify_api(cid, secret, username_spotify, scope, uri_redirect)

    collection_mongo_all_musics = mongo_connect_to_collection(username_mongo, password, cluster_uri, 
                                                              database_name, collection_name)

    for url in playlists_urls:
        print("########## playlist_url : ", url)
        tracks = get_all_playlist_tracks(url)
        nb_tracks = len(tracks)

        for i in range(nb_tracks):
            current_time = time.time()
            time_elapsed = current_time - last_time

            if time_elapsed >= 900:
                con_spotify_api(cid, secret, username_spotify, scope, uri_redirect)
                last_time = current_time
            track_id = tracks[i]["track"]["id"]
            cursor = collection_mongo_all_musics.find({}, {"track_id": 1})
            track_ids = [document["track_id"] for document in cursor]

            if track_ids.count(track_id) == 0:
                print("########## track_id : ", track_id)
                track_name = tracks[i]["track"]["name"]
                track_year = tracks[i]["track"]["album"]["release_date"][0:4]
                track_popularity = tracks[i]["track"]["popularity"]
                album_name = tracks[i]["track"]["album"]["name"]
                image_url = tracks[i]["track"]["album"]["images"][1]["url"]
                image_id = image_url.split("image/", 1)[-1]
                main_artist = tracks[i]["track"]["artists"][0]["name"]
                nb_artists = len(tracks[i]["track"]["artists"])
                featurings = []

                if nb_artists > 1:
                    for j in range(1, nb_artists):
                        feat_artist = tracks[j]["track"]["artists"][0]["name"]
                        featurings.append(feat_artist)
                else:
                    pass

                new_name = re.sub("'", "", main_artist)
                main_artist_info = sp.search(new_name, type="artist")
                artist_genre = main_artist_info["artists"]["items"][0]["genres"]
                audio_features = sp.audio_features(track_id)
                track_features = audio_features[0]
                danceability = track_features["danceability"]
                energy = track_features["energy"]
                key = track_features["key"]
                loudness = track_features["loudness"]
                mode = track_features["mode"]
                speechiness = track_features["speechiness"]
                acousticness = track_features["acousticness"]
                instrumentalness = track_features["instrumentalness"]
                liveness = track_features["liveness"]
                valence = track_features["valence"]
                tempo = track_features["tempo"]
                duration_ms = track_features["duration_ms"]
                time_signature = track_features["time_signature"]

                dict_track = {
                    "track_id" : track_id,
                    "titre" : track_name,
                    "year" : track_year,
                    "artists" : {
                        "main_artist" : main_artist,
                        "featurings" : featurings,
                        "artist_genre" : artist_genre
                    },
                    "album" : {
                        "album_name" : album_name,
                        "album_image" : image_id
                    },
                    "features" : {
                        "popularity" : track_popularity,
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
                        "liveness" : liveness
                    }
                }

                insert_result = collection_mongo_all_musics.insert_one(dict_track)

                if insert_result.acknowledged:
                    print("Data inserted successfully.")
                else:
                    print("Insertion failed.")

            else:
                print("Déjà dans la base")



def main(arg):
    if len(arg) == 2:
        print(arg[1])
        con_spotify_api(cid, secret, username_spotify, scope, uri_redirect)
        file_path = arg[1]
        list_playlists_urls = read_file_to_list(file_path)
        insert_playlists_to_mongo(list_playlists_urls)
    else:
        print("Mauvaise entrée renseigner le chemin vers le fichier comportant les urls des playlists à ajouter")


if __name__ == "__main__":
    main(sys.argv)