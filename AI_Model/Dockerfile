# Utilisez une image de base Python
FROM python:latest

# Répertoire de travail dans le conteneur
WORKDIR /app

# Copiez les fichiers locaux dans le conteneur
COPY . /app/

RUN pip install --upgrade pip
# RUN /bin/sh -c git clone -y https://github.com/mongodb/mongo-python-driver.git
# RUN /bin/sh -c cd pymongo/
# RUN /bin/sh -c pip install .
# RUN /bin/sh -c apt-get install -y build-essential python-driver
# RUN /bin/sh -c yum install -y gcc python-deval
# RUN /bin/sh -c pip3 uninstall bson
# RUN /bin/sh -c pip3 uninstall pymongo
# RUN /bin/sh -c python3 -m pip install pymongo
# RUN /bin/sh -c python3 -m install --upgrade pymongo
# Installez les dépendances (si nécessaire)
RUN pip3 install -r requirements.txt

# Commande par défaut pour exécuter votre application
RUN pwd
RUN python /app/scripts/update_all_users_reco.py "./model/best_param_model.pkl"
# CMD ["python", "/app/scripts/update_all_users_reco.py", "./model/best_param_model.pkl"]