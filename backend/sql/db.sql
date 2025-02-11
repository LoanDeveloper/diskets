-- Création de la table users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'utilisateur' CHECK (role IN ('admin', 'utilisateur'))
);

-- Création de la table categories
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE
);

-- Création de la table types (absence, retard)
CREATE TABLE types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    texte ENUM('absence', 'retard') NOT NULL UNIQUE
);

-- Création de la table excuses
CREATE TABLE excuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categorie_id INT NOT NULL,
    type_id INT NOT NULL,
    texte TEXT NOT NULL,
    FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (type_id) REFERENCES types(id) ON DELETE CASCADE
);

-- Création de la table likes
CREATE TABLE likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    excuse_id INT NOT NULL,
    utilisateur_id INT NOT NULL,
    FOREIGN KEY (excuse_id) REFERENCES excuses(id) ON DELETE CASCADE,
    FOREIGN KEY (utilisateur_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Création de la table votes
CREATE TABLE votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    excuse_id INT NOT NULL,
    utilisateur_id INT NOT NULL,
    vote BOOLEAN NOT NULL,
    FOREIGN KEY (excuse_id) REFERENCES excuses(id) ON DELETE CASCADE,
    FOREIGN KEY (utilisateur_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Création de la table justificatifs
CREATE TABLE justificatifs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    excuse_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (excuse_id) REFERENCES excuses(id) ON DELETE CASCADE
);
