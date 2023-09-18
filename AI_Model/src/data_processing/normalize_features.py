#!/usr/bin/env python
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler



med_pol_feat = ["speechiness", "acousticness", "instrumentalness", "liveness", 
                         "valence", "danceability", "energy", "loudness"]

minmax_feat = ["loudness", "tempo", "duration_ms"]

rob_feat = ["key", "time_signature"]

stand_feat = ["danceability", "energy","loudness"]



# Normaliser de manière cohérentes les features
def normalize_music_features_dataframe(input_df, med_polarize_features=med_pol_feat, 
                                       minmax_norm_features=minmax_feat, robust_norm_features=rob_feat,
                                       stand_norm_features=stand_feat):
    
    '''
        Cette fonction normalize les données du datframe donné en entrée:
        Paramètres:
            input_df : dataframe contenant les données à normaliser
            med_polarize_features : La liste des données à polariser par la médianne :
                                        Données présentant des données extêmes contraires
                                    Valeurs initiales :
                                    "speechiness", "acousticness", "instrumentalness",  "energy",
                                    "liveness", "valence", "danceability", "loudness"
            minmax_norm_features : Liste des données à normaliser par un MinMaxScaler :
                                        Données à faibles outliers
                                    Valeurs initiales :
                                    "loudness", "tempo", "duration_ms"
            robust_norm_features : Liste des données à normaliser par un RobustScaler :
                                        Données à forts outliers
                                    Valeurs initiales : 
                                    "key", "time_signature"
            stand_norm_features : La liste des données à normaliser selon une loie normale.
                                    Valeurs initiales :
                                    "danceability", "energy","loudness"
        Output : 
            Renvoie le Dataframe avec les données normalisées
    '''

    df = input_df.copy()
    
    for feat in stand_norm_features:
        std_scaler = StandardScaler()
        df[feat] = std_scaler.fit_transform(df[feat].values.reshape(-1, 1))
    
    minmax_scaler = MinMaxScaler()
    for feat in minmax_norm_features:
        df[feat] = minmax_scaler.fit_transform(df[feat].values.reshape(-1, 1))
        
    robust_scaler = RobustScaler()
    for feat in robust_norm_features:
        df[feat] = robust_scaler.fit_transform(df[feat].values.reshape(-1, 1))

    df[med_polarize_features] = df[med_polarize_features].sub(df[med_polarize_features].median())

    return df