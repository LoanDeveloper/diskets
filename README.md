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


**Categories**
- id (INT, AUTO_INCREMENT) : Identifiant unique de la catégorie.
- nom (VARCHAR(100)) : Nom de la catégorie (ex : travail, école, etc.).

**Types**
- id (INT, AUTO_INCREMENT) : Identifiant unique du type.
- nom (VARCHAR(100)) : Nom du type (ex : absence, retard, excuse générale).

**Excuses**
- id (INT, AUTO_INCREMENT) : Identifiant unique de l'excuse.
- categorie_id (INT) : Identifiant de la catégorie à laquelle l'excuse appartient.
- type_id (INT) : Identifiant du type d'excuse.
- texte (TEXT) : Texte de l'excuse générée par l'IA.

**Likes**
- id (INT, AUTO_INCREMENT) : Identifiant unique du like.
- excuse_id (INT) : Identifiant de l'excuse likée.
- utilisateur_id (INT) : Identifiant de l'utilisateur qui a liké.

**Votes**
- id (INT, AUTO_INCREMENT) : Identifiant unique du vote.
- excuse_id (INT) : Identifiant de l'excuse votée.
- vote (BOOLEAN) : Valeur du vote (1 = upvote, 0 = downvote).

**Justificatifs**
- id (INT, AUTO_INCREMENT) : Identifiant unique du justificatif.
- excuse_id (INT) : Identifiant de l'excuse liée au justificatif.
- image_url (VARCHAR(255)) : URL de l'image générée du justificatif.

## 📜 License
Ce projet est sous licence MIT.
