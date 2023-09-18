#!/usr/bin/env python
import spotipy
import spotipy.util as util
from spotipy.oauth2 import SpotifyClientCredentials



def con_spotify_api(cid, secret, username, scope, uri_redirect):

    client_credentials_manager = SpotifyClientCredentials(client_id=cid, client_secret=secret) 
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

    token = util.prompt_for_user_token(username, scope, client_id=cid, client_secret=secret, 
                                       redirect_uri=uri_redirect)

    if token:
        sp = spotipy.Spotify(auth=token)
        print("L'utilisateur " + sp.current_user()["display_name"] + " est connecté !")

    else:
        print("Erreur d'authentification / Connexion", username)

    return sp