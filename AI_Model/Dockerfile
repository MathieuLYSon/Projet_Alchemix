# Utilisez une image de base Python
FROM python:3.8

# Répertoire de travail dans le conteneur
WORKDIR /app

# Copiez les fichiers locaux dans le conteneur
COPY ./ /app/

# Installez les dépendances (si nécessaire)
RUN pip install -r requirements.txt

# Commande par défaut pour exécuter votre application
CMD ["python", "/app/scripts/update_all_users_reco.py"]