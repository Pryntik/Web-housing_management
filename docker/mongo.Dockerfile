# Utiliser l'image MongoDB officielle
FROM mongo:latest

# Mettre à jour les paquets et ajouter le dépôt MongoDB
RUN apt-get update && \
    apt-get install -y gnupg wget && \
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add - && \
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list && \
    apt-get update && \
    apt-get install -y mongodb-org-tools

# Exposer le port MongoDB
EXPOSE 27017

# Commande pour démarrer MongoDB
CMD ["mongod"]