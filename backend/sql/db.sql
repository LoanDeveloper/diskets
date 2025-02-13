-- Création de la table categories
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE
);

-- Création de la table types (absence, retard)
CREATE TABLE types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    texte ENUM('absence', 'retard') NOT NULL,
    UNIQUE(texte) -- Contrainte UNIQUE correctement ajoutée
);

-- Création de la table excuses
CREATE TABLE excuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categorie VARCHAR(100) NOT NULL,
    type VARCHAR(100) NOT NULL,
    texte TEXT NOT NULL
);

-- Création de la table likes
CREATE TABLE likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    excuse_id INT NOT NULL,
    FOREIGN KEY (excuse_id) REFERENCES excuses(id) ON DELETE CASCADE
);

-- Création de la table votes
CREATE TABLE votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    excuse_id INT NOT NULL,
    vote BOOLEAN NOT NULL,
    FOREIGN KEY (excuse_id) REFERENCES excuses(id) ON DELETE CASCADE
);

-- Création de la table justificatifs
CREATE TABLE justificatifs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    excuse_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (excuse_id) REFERENCES excuses(id) ON DELETE CASCADE
);

INSERT INTO categories (nom) VALUES
('Santé'),
('Travail'),
('Famille');

INSERT INTO types (texte) VALUES
('absence'),
('retard');

INSERT INTO excuses (categorie, type, texte) VALUES
('Santé', 'absence', 'Je suis malade, je ne peux pas venir aujourd\'hui.'),
('Travail', 'retard', 'Je suis en retard à cause du trafic.'),
('Famille', 'absence', 'J\'ai un rendez-vous médical pour un membre de ma famille.');


