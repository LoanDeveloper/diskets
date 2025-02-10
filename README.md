# Diskets - Générateur d'Excuses avec IA

Diskets est une application web permettant de générer des excuses automatisées grâce à l'IA Mistral.
Les excuses sont classées par catégorie, et les utilisateurs peuvent interagir avec elles via un système de likes, upvotes et downvotes. Une fonctionnalité bonus permet de générer des images de faux justificatifs.

## 🚀 Stack Technique

- Frontend : React 
- Backend : Express.js
- Base de données : MySQL
- Authentification : JWT + bcrypt
- IA : API Mistral

## 🎯 Fonctionnalités

- 🔐 Gestion d'utilisateurs sécurisée avec JWT et bcrypt
- 🤖 Génération d'excuses IA classées par catégories (travail, école, famille...)
- 👍👎 Upvote / Downvote des excuses pour les classer
- ❤️ Likes d'excuses pour sauvegarder ses favorites
- 📜 Génération d'images de faux justificatifs (option bonus)

## 📚 Base de Données

**Users**
- id (INT, AUTO_INCREMENT) : Identifiant unique de l'utilisateur.
- email (VARCHAR(255)) : Adresse email de l'utilisateur.
- password (VARCHAR(255)) : Mot de passe crypté de l'utilisateur.
- role (VARCHAR(50)) : Rôle de l'utilisateur (ex : "admin", "utilisateur").

**Excuses**
- id (INT, AUTO_INCREMENT) : Identifiant unique de l'excuse.
- categorie (VARCHAR(100)) : Catégorie de l'excuse (travail, école, etc.).
- texte (TEXT) : Texte de l'excuse générée par l'IA.

**Likes**
- id (INT, AUTO_INCREMENT) : Identifiant unique du like.
- excuse_id (INT) : Identifiant de l'excuse likée.
- utilisateur_id (INT) : Identifiant de l'utilisateur qui a liké.

**Votes**
- id (INT, AUTO_INCREMENT) : Identifiant unique du vote.
- excuse_id (INT) : Identifiant de l'excuse votée.
- utilisateur_id (INT) : Identifiant de l'utilisateur qui a voté.
- vote (BOOLEAN) : Valeur du vote (1 = upvote, 0 = downvote).

**Justificatifs**
- id (INT, AUTO_INCREMENT) : Identifiant unique du justificatif.
- excuse_id (INT) : Identifiant de l'excuse liée au justificatif.
- image_url (VARCHAR(255)) : URL de l'image générée du justificatif.

## 📜 License
Ce projet est sous licence MIT.
