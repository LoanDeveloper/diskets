import "dotenv/config"; 
import express from "express";
import { Mistral } from "@mistralai/mistralai";
import cors from "cors"

const app = express();
const port = process.env.PORT || 3000;

app.use(cors())


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

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
