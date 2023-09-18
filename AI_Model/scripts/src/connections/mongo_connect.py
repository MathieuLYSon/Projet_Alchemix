#!/usr/bin/env python
import pymongo



def mongo_connect_to_database(username, password, cluster_uri, database_name):

    client = pymongo.MongoClient(f"mongodb+srv://{username}:{password}@{cluster_uri}/{database_name}", 
                                 tls=True,  tlsAllowInvalidCertificates=True)
    db_mongo = client[database_name]

    return db_mongo



# Create a MongoDB client and connect to your cluster
def mongo_connect_to_collection(username, password, cluster_uri, database_name, collection_name):

    client = pymongo.MongoClient(f"mongodb+srv://{username}:{password}@{cluster_uri}/{database_name}", 
                                 tls=True,  tlsAllowInvalidCertificates=True)
    db_mongo = client[database_name]
    collection_mongo = db_mongo[collection_name]

    return collection_mongo