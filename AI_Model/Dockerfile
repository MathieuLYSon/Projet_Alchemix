# Utilisez une image de base Python
FROM python:3.8

# Répertoire de travail dans le conteneur
WORKDIR /app

# Copiez les fichiers locaux dans le conteneur
COPY ./src /app

# Installez les dépendances (si nécessaire)
RUN pip install -r requirements.txt

# Commande par défaut pour exécuter votre application
CMD ["python", "mon_script.py"]
