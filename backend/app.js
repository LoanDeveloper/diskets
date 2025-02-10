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

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ' + db.threadId);
});

// Assurez-vous que la base de données active est définie
db.query('USE bmazon', (err) => {
  if (err) {
      console.error('Erreur lors de la sélection de la base de données :', err.message);
  } else {
      console.log('Base de données active : bmazon');
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
