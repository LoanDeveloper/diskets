require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");

const app = express();
const port = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());


console.log("DB_HOST", process.env.DB_HOST)

// Connexion à la base de données
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error("Erreur de connexion à MySQL:", err);
        return;
    }
    console.log("Connecté à la base de données MySQL");
});

// Routes API
app.get("/", (req, res) => {
    res.send("Bienvenue sur mon API avec Express et MySQL !");
});

// 📌 1. Récupérer tous les utilisateurs
app.get("/api/users", (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// 📌 2. Récupérer un utilisateur par ID
app.get("/api/users/:id", (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.json(results[0]);
    });
});

// 📌 3. Ajouter un utilisateur
app.post("/api/users", (req, res) => {
    const { name, email } = req.body;
    db.query("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, name, email });
    });
});

// 📌 4. Mettre à jour un utilisateur
app.put("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    db.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Utilisateur mis à jour" });
    });
});

// 📌 5. Supprimer un utilisateur
app.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM users WHERE id = ?", [id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Utilisateur supprimé" });
    });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
