import "dotenv/config"; 
import express from "express";
import { Mistral } from "@mistralai/mistralai";
import cors from "cors"
import mysql from "mysql2";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())


const mistral = new Mistral({
    apiKey: process.env.MISTRAL_API_KEY,
});


app.get("/", (req, res) => {
    res.send("Bienvenue sur mon API avec Express et Mistral AI !");
});

app.get("/api/escuses", async (req, res) => {

    const {type, categorie} = req.query;

    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");
    
    if (!type) {
        return res.status(400).json({ error: "type requis" });
    }

    try {
        const result = await mistral.chat.stream({
            model: "mistral-large-latest",
            messages: [{role: 'user', 
            content: `Génère moi une excuse pour ${type} dans le cadre ${categorie}. Je veux que tu me retourne seulement l'excuse en seule phrase courte.
            `}]
        });
        
        for await (const chunk of result) {
            const streamText = chunk.data.choices[0].delta.content;
            res.write(`data: ${JSON.stringify(streamText)}\n\n`);
            if(chunk.data.choices[0].finishReason === "stop"){
                break;
            }
        }

        res.write("data: [DONE]\n\n");
        res.end();
        

    } catch (error) {
        console.error("Erreur API Mistral :", error);
        res.write("data: Erreur lors de l'appel à l'API Mistral\n\n");
        res.end();
    }
});

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
  
  
  // API Routes
  
  // Excuses
  
  app.get('/excuses', (req, res) => {
    const sql = 'SELECT * FROM excuses';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send('Erreur lors de la récupération des excuses');
        }
        res.json(results);
    });
  });

  // Ajouter une nouvelle excuse (avec validation de categorie_id)
  app.post('/excuses', (req, res) => {
    const { type ,categorie, texte } = req.body;
  
    if (!categorie || !texte || !type) {
        return res.status(400).send('Les champs categorie et texte et type sont obligatoires');
    }

    if(texte === "Erreur lors de l'appel à l'API Mistral"){
        return res.status(400).json({ error: "Vous ne pouvez pas enregistrer les erreurs."});
    }

    const checkExcuseSQL = 'SELECT texte FROM excuses WHERE texte = ?';
    db.query(checkExcuseSQL, [texte], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erreur lors de la vérification de la catégorie"});
        }
        if (results.length > 0) {
            return res.status(400).json({ error: "Il existe déjà dans la base de donnée"});
        }
        // Insérer l'excuse
        const sql = 'INSERT INTO excuses (categorie, type, texte) VALUES (?, ?, ?)';
        db.query(sql, [categorie, type, texte], (err, result) => {
            if (err) {
                return res.status(500).send('Erreur lors de l\'ajout de l\'excuse');
            }
            res.status(201).json({ id: result.insertId, categorie, type, texte });
        });
    });
});
  
  // Mettre à jour une excuse (avec validation de categorie_id)
  app.put('/excuses/:id', (req, res) => {
    const { id } = req.params;
    const { categorie_id, texte } = req.body;
  
    if (!categorie_id && !texte) {
        return res.status(400).send('Au moins un champ (categorie_id ou texte) doit être fourni');
    }
  
    // Vérifier si la catégorie existe si elle est fournie
    if (categorie_id) {
        const checkCategorySQL = 'SELECT id FROM categories WHERE id = ?';
        db.query(checkCategorySQL, [categorie_id], (err, results) => {
            if (err) {
                return res.status(500).send('Erreur lors de la vérification de la catégorie');
            }
            if (results.length === 0) {
                return res.status(400).send('La catégorie spécifiée n\'existe pas');
            }
  
            // Mettre à jour l'excuse
            updateExcuse();
        });
    } else {
        updateExcuse();
    }
  
    function updateExcuse() {
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
    }
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
  
  // Catégories
  
  // Obtenir toutes les catégories
  app.get('/categories', (req, res) => {
    const sql = 'SELECT * FROM categories';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send('Erreur lors de la récupération des catégories');
        }
        res.json(results);
    });
  });
  
  // Obtenir une catégorie par son ID
  app.get('/categories/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM categories WHERE id = ?';
  
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).send('Erreur lors de la récupération de la catégorie');
        }
        if (results.length === 0) {
            return res.status(404).send('Catégorie non trouvée');
        }
        res.json(results[0]);
    });
  });
  
  // Ajouter une nouvelle catégorie
  app.post('/categories', (req, res) => {
    const { nom } = req.body;
  
    if (!nom) {
        return res.status(400).json({ error: "Le champ nom est obligatoire"});

    }
  
    const sql = 'INSERT INTO categories (nom) VALUES (?)';
    db.query(sql, [nom], (err, result) => {
        if (err) {
            return res.status(400).json({ error: "Erreur lors de l\'ajout de la catégorie"});
            
        }
        res.status(201).json({ id: result.insertId, nom });
    });
  });
  
  // Mettre à jour une catégorie
  app.put('/categories/:id', (req, res) => {
    const { id } = req.params;
    const { nom } = req.body;
  
    if (!nom) {
        return res.status(400).send('Le champ nom est obligatoire');
    }
  
    const sql = 'UPDATE categories SET nom = ? WHERE id = ?';
    db.query(sql, [nom, id], (err, result) => {
        if (err) {
            return res.status(500).send('Erreur lors de la mise à jour de la catégorie');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Catégorie non trouvée');
        }
        res.json({ id, nom });
    });
  });
  
  // Supprimer une catégorie
  app.delete('/categories/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM categories WHERE id = ?';
  
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).send('Erreur lors de la suppression de la catégorie');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Catégorie non trouvée');
        }
        res.send(`Catégorie avec l'id ${id} supprimée.`);
    });
  });

  // Justificatifs 
  
  // Obtenir tous les justificatifs
  app.get('/justificatifs', (req, res) => {
    const sql = 'SELECT * FROM justificatifs';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send('Erreur lors de la récupération des justificatifs');
        }
        res.json(results);
    });
  });
  
  // Obtenir un justificatif par ID
  app.get('/justificatifs/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM justificatifs WHERE id = ?';
  
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).send('Erreur lors de la récupération du justificatif');
        }
        if (results.length === 0) {
            return res.status(404).send('Justificatif non trouvé');
        }
        res.json(results[0]);
    });
  });
  
  // Ajouter un justificatif
  app.post('/justificatifs', (req, res) => {
    const { excuse_id, image_url } = req.body;
  
    if (!excuse_id || !image_url) {
        return res.status(400).send('Les champs excuse_id et image_url sont obligatoires');
    }
  
    const sql = 'INSERT INTO justificatifs (excuse_id, image_url) VALUES (?, ?)';
    db.query(sql, [excuse_id, image_url], (err, result) => {
        if (err) {
            return res.status(500).send('Erreur lors de l\'ajout du justificatif');
        }
        res.status(201).json({ id: result.insertId, excuse_id, image_url });
    });
  });
  
  // Mettre à jour un justificatif
  app.put('/justificatifs/:id', (req, res) => {
    const { id } = req.params;
    const { excuse_id, image_url } = req.body;
  
    const sql = `
        UPDATE justificatifs 
        SET excuse_id = COALESCE(?, excuse_id), 
            image_url = COALESCE(?, image_url)
        WHERE id = ?`;
  
    db.query(sql, [excuse_id, image_url, id], (err, result) => {
        if (err) {
            return res.status(500).send('Erreur lors de la mise à jour du justificatif');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Justificatif non trouvé');
        }
        res.json({ id, excuse_id, image_url });
    });
  });
  
  
  // Supprimer un justificatif
  app.delete('/justificatifs/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM justificatifs WHERE id = ?';
  
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).send('Erreur lors de la suppression du justificatif');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Justificatif non trouvé');
        }
        res.send(`Justificatif avec l'id ${id} supprimé.`);
    });
  });
  
  // Likes
  
  // Obtenir tous les likes
  app.get('/likes', (req, res) => {
    const sql = 'SELECT * FROM likes';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send('Erreur lors de la récupération des likes');
        }
        res.json(results);
    });
  });
  
  // Ajouter un like
  app.post('/likes', (req, res) => {
    const { excuse_id } = req.body;
  
    if (!excuse_id ) {
        return res.status(400).send('Les champs excuse_id sont obligatoires');
    }
  
    const sql = 'INSERT INTO likes (excuse_id) VALUES (?)';
    db.query(sql, [excuse_id], (err, result) => {
        if (err) {
            return res.status(500).send('Erreur lors de l\'ajout du like');
        }
        res.status(201).json({ id: result.insertId, excuse_id });
    });
  });
  
  // Mettre à jour un like (changer l'excuse likée ou l'utilisateur)
  app.put('/likes/:id', (req, res) => {
    const { id } = req.params;
    const { excuse_id, utilisateur_id } = req.body;
  
    const sql = `
        UPDATE likes 
        SET excuse_id = COALESCE(?, excuse_id), 
            utilisateur_id = COALESCE(?, utilisateur_id)
        WHERE id = ?`;
  
    db.query(sql, [excuse_id, utilisateur_id, id], (err, result) => {
        if (err) {
            return res.status(500).send('Erreur lors de la mise à jour du like');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Like non trouvé');
        }
        res.json({ id, excuse_id, utilisateur_id });
    });
  });
  
  
  // Supprimer un like
  app.delete('/likes/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM likes WHERE id = ?';
  
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).send('Erreur lors de la suppression du like');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Like non trouvé');
        }
        res.send(`Like avec l'id ${id} supprimé.`);
    });
  });
  
  // Votes
  
  // Obtenir tous les votes
  app.get('/votes', (req, res) => {
    const sql = 'SELECT * FROM votes';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send('Erreur lors de la récupération des votes');
        }
        res.json(results);
    });
  });
  
  // Ajouter un vote
  app.post('/votes', (req, res) => {
    const { excuse_id, utilisateur_id, vote } = req.body;
  
    if (!excuse_id || !utilisateur_id || vote === undefined) {
        return res.status(400).send('Les champs excuse_id, utilisateur_id et vote sont obligatoires');
    }
  
    const sql = 'INSERT INTO votes (excuse_id, utilisateur_id, vote) VALUES (?, ?, ?)';
    db.query(sql, [excuse_id, utilisateur_id, vote], (err, result) => {
        if (err) {
            return res.status(500).send('Erreur lors de l\'ajout du vote');
        }
        res.status(201).json({ id: result.insertId, excuse_id, utilisateur_id, vote });
    });
  });
  
  // Mettre à jour un vote (changer la valeur du vote ou l'utilisateur)
  app.put('/votes/:id', (req, res) => {
    const { id } = req.params;
    const { excuse_id, utilisateur_id, vote } = req.body;
  
    const sql = `
        UPDATE votes 
        SET excuse_id = COALESCE(?, excuse_id), 
            utilisateur_id = COALESCE(?, utilisateur_id), 
            vote = COALESCE(?, vote)
        WHERE id = ?`;
  
    db.query(sql, [excuse_id, utilisateur_id, vote, id], (err, result) => {
        if (err) {
            return res.status(500).send('Erreur lors de la mise à jour du vote');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Vote non trouvé');
        }
        res.json({ id, excuse_id, utilisateur_id, vote });
    });
  });
  
  
  // Supprimer un vote
  app.delete('/votes/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM votes WHERE id = ?';
  
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).send('Erreur lors de la suppression du vote');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Vote non trouvé');
        }
        res.send(`Vote avec l'id ${id} supprimé.`);
    });
  });
  
  // Types 
  
  // Obtenir tous les types
  app.get('/types', (req, res) => {
      const sql = 'SELECT * FROM types';
      db.query(sql, (err, results) => {
          if (err) {
              return res.status(500).send('Erreur lors de la récupération des types');
          }
          res.json(results);
      });
  });
  
  // Ajouter un nouveau type
  app.post('/types', (req, res) => {
      const { texte } = req.body;
  
      if (!texte || (texte !== 'absence' && texte !== 'retard')) {
          return res.status(400).send('Le champ texte doit être "absence" ou "retard"');
      }
  
      const sql = 'INSERT INTO types (texte) VALUES (?)';
      db.query(sql, [texte], (err, result) => {
          if (err) {
              return res.status(500).send("Erreur lors de l'ajout du type");
          }
          res.status(201).json({ id: result.insertId, texte });
      });
  });
  
  // Mettre à jour un type
  app.put('/types/:id', (req, res) => {
      const { id } = req.params;
      const { texte } = req.body;
  
      if (texte && texte !== 'absence' && texte !== 'retard') {
          return res.status(400).send('Le champ texte doit être "absence" ou "retard"');
      }
  
      const sql = 'UPDATE types SET texte = COALESCE(?, texte) WHERE id = ?';
      db.query(sql, [texte, id], (err, result) => {
          if (err) {
              return res.status(500).send("Erreur lors de la mise à jour du type");
          }
          if (result.affectedRows === 0) {
              return res.status(404).send('Type non trouvé');
          }
          res.json({ id, texte });
      });
  });
  
  // Supprimer un type
  app.delete('/types/:id', (req, res) => {
      const { id } = req.params;
      const sql = 'DELETE FROM types WHERE id = ?';
  
      db.query(sql, [id], (err, result) => {
          if (err) {
              return res.status(500).send("Erreur lors de la suppression du type");
          }
          if (result.affectedRows === 0) {
              return res.status(404).send('Type non trouvé');
          }
          res.send(`Type avec l'id ${id} supprimé.`);
      });
  });

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
