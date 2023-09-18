#!/usr/bin/env python
import sys

# __init__.py
from src.collect_data.get_user_histo import get_user_histo
from src.collect_data.get_user_matrix import get_user_matrix
from src.collect_data.get_all_user_ids import get_all_user_ids
from src.collect_data.get_user_likes import get_user_liked_musics
from src.collect_data.get_user_reco import get_user_recommendations



def main(model_path : str):

    user_ids = get_all_user_ids()

    for user in user_ids:
        print("En cours de recommandation pour :", user)
        user_histo_musics = get_user_histo(user)
        user_likes_musics = get_user_liked_musics(user)
        user_matrix = get_user_matrix(user_histo_musics, user_likes_musics)
        get_user_recommendations(user_matrix, model_path)



def main(arg):
    
    if len(arg) == 2:
        print(arg[1])
        model = arg[1]
        main(model)
    else:
        print("Mauvaise entrée il faut renseigner l'identifiant de l'utilisateur")
    
    print("Les recommandations ont été mises à jour")
    exit()



if __name__ == "__main__":
    main(sys.argv)