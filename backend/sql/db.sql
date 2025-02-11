-- Table des utilisateurs
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user'
);

-- Table des catégories
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

-- Table des excuses
CREATE TABLE excuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categorie_id INT NOT NULL,
    texte TEXT NOT NULL,
    FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Table des likes
CREATE TABLE likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    excuse_id INT NOT NULL,
    utilisateur_id INT NOT NULL,
    FOREIGN KEY (excuse_id) REFERENCES excuses(id) ON DELETE CASCADE,
    FOREIGN KEY (utilisateur_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des votes
CREATE TABLE votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    excuse_id INT NOT NULL,
    utilisateur_id INT NOT NULL,
    vote BOOLEAN NOT NULL,
    FOREIGN KEY (excuse_id) REFERENCES excuses(id) ON DELETE CASCADE,
    FOREIGN KEY (utilisateur_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des justificatifs
CREATE TABLE justificatifs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    excuse_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (excuse_id) REFERENCES excuses(id) ON DELETE CASCADE
);
