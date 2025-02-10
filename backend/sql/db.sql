-- Table des utilisateurs
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- Table des excuses
CREATE TABLE Excuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categorie VARCHAR(100) NOT NULL,
    texte TEXT NOT NULL
);

-- Table des likes
CREATE TABLE Likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    excuse_id INT NOT NULL,
    utilisateur_id INT NOT NULL,
    FOREIGN KEY (excuse_id) REFERENCES Excuses(id) ON DELETE CASCADE,
    FOREIGN KEY (utilisateur_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Table des votes
CREATE TABLE Votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    excuse_id INT NOT NULL,
    utilisateur_id INT NOT NULL,
    vote BOOLEAN NOT NULL,
    FOREIGN KEY (excuse_id) REFERENCES Excuses(id) ON DELETE CASCADE,
    FOREIGN KEY (utilisateur_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Table des justificatifs
CREATE TABLE Justificatifs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    excuse_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (excuse_id) REFERENCES Excuses(id) ON DELETE CASCADE
);