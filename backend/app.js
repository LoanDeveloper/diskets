const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');

require('dotenv-flow').config();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT", "DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
})



// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ' + db.threadId);
});

// Assurez-vous que la base de données active est définie
db.query('USE diskets', (err) => {
  if (err) {
      console.error('Erreur lors de la sélection de la base de données :', err.message);
  } else {
      console.log('Base de données active : diskets');
  }
});



app.get('/excuses', (req, res) => {
  const sql = 'SELECT * FROM excuses';
  db.query(sql, (err, results) => {
      if (err) {
          return res.status(500).send('Erreur lors de la récupération des excuses');
      }
      res.json(results);
  });
});

// Ajouter une nouvelle excuse
app.post('/excuses', (req, res) => {
  const { categorie_id, texte } = req.body;

  if (!categorie_id || !texte) {
      return res.status(400).send('Les champs categorie_id et texte sont obligatoires');
  }

  const sql = 'INSERT INTO excuses (categorie_id, texte) VALUES (?, ?)';
  db.query(sql, [categorie_id, texte], (err, result) => {
      if (err) {
          return res.status(500).send('Erreur lors de l\'ajout de l\'excuse');
      }
      res.status(201).json({ id: result.insertId, categorie_id, texte });
  });
});

app.put('/excuses/:id', (req, res) => {
  const { id } = req.params;
  const { categorie_id, texte } = req.body;

  const sql = `
      UPDATE excuses
      SET categorie_id = COALESCE(?, categorie_id),
          texte = COALESCE(?, texte)
      WHERE id = ?`;

  db.query(sql, [categorie_id, texte, id], (err, result) => {
      if (err) {
          return res.status(500).send('Erreur lors de la mise à jour de l\'excuse');
      }
      if (result.affectedRows === 0) {
          return res.status(404).send('Excuse non trouvée');
      }
      res.json({ id, categorie_id, texte });
  });
});

app.delete('/excuses/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM excuses WHERE id = ?';

  db.query(sql, [id], (err, result) => {
      if (err) {
          return res.status(500).send('Erreur lors de la suppression de l\'excuse');
      }
      if (result.affectedRows === 0) {
          return res.status(404).send('Excuse non trouvée');
      }
      res.send(`Excuse avec l'id ${id} supprimée.`);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
