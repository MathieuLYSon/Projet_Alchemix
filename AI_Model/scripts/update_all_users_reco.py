#!/usr/bin/env python
import sys
from bson import ObjectId

#__init__.py
# from src.data_processing.bson.objectid import ObjectId
from utils.check_data_exist import check_data_existance
from src.collect_data.get_user_histo import get_user_histo
from src.collect_data.get_user_matrix import get_user_matrix
from src.collect_data.get_all_user_ids import get_all_user_ids
from src.collect_data.get_user_likes import get_user_liked_musics
from src.collect_data.get_user_reco import get_user_recommendations



def all_user_reco(model_path : str):

    user_ids = get_all_user_ids()
    print(user_ids)
    
    for user in user_ids:
        print("En cours de recommandation pour : \n", user)
        mongo_id = ObjectId(user)
        user_histo_musics = get_user_histo(mongo_id)
        print(type(user_histo_musics))
        print("############### HISTO_USER ############### : \n", user_histo_musics.columns)
        user_likes_musics = get_user_liked_musics(mongo_id)
        print(type(user_likes_musics))
        print("############### likes_USER ############### : \n", user_likes_musics.columns)

        user_matrix = get_user_matrix(user_histo_musics, user_likes_musics)
        print(type(user_matrix))
        print("############### matrix_USER ############### : \n", user_matrix.columns)
        get_user_recommendations(user_matrix, model_path)



def main(arg):
    
    print(arg)
    print(len(arg))
    if check_data_exist() == True:
        print("Il y a des données")
        
        if len(arg) == 2:
            print(arg[1])
            all_user_reco(arg[1])
            
        else:
            print("Mauvaise entrée il faut renseigner le chemin vers le modèle")
            
    else:
        print(" #################### Pas de données à traiter #################### \n")
        
    print("Les recommandations ont été mises à jour")
    exit()



if __name__ == "__main__":
    main(sys.argv)