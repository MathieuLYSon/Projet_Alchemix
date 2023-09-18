#!/usr/bin/env python3
# Spotify API
import spotipy
import spotipy.util as util
from spotipy.oauth2 import SpotifyClientCredentials

# OS
import requests

# Mongo
import pymongo

# URL manipulation
import urllib.request

# Mongo Atlas
username = "Sn4keyes"
password = "?nBZFOid2804!"
cluster_uri = "cluster0.kjfexm6.mongodb.net"
database_name = "mern"

# Create a MongoDB client and connect to your cluster
client = pymongo.MongoClient(f"mongodb+srv://{username}:{password}@{cluster_uri}/{database_name}", tls=True,  tlsAllowInvalidCertificates=True)
db_mongo = client[database_name]
collection_mongo = db_mongo["all_musics"]

# Fonction qui récupère l'url d'une image et l'enregistre au 'save_path' indiqué
def download_image(image_url, image_id):
    save_path = ("./uploads/images_musics/" + image_id + ".jpg")                       # Changer ./images/ par le dossier ou tu télécharges les images
    urllib.request.urlretrieve(image_url, save_path, overwrite=True)

def get_image_url():
    cursor = collection_mongo.find({}, {"album.album_image" : 1})
    image_urls = []
    for document in cursor:
        image_id = document['album']['album_image']
        image_url = "https://i.scdn.co/image/" + image_id               # Ici changer pour l'url locale
        image_urls.append((image_url, image_id))
    return image_urls

def download_all_images():
    image_info = get_image_url()
    for (image_id, image_url) in image_info:
        download_image(image_url, image_id)

def main():
    
    download_all_images()

if __name__ == "__main__":
    main()