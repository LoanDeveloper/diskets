import React, { useEffect, useState } from "react";
import { ClipboardDocumentCheckIcon, CheckIcon } from "@heroicons/react/24/solid";
import { Modal, Box, Typography, Button } from "@mui/material";

const ExcuseItem = ({ category, type }) => {
    const [excuse, setExcuse] = useState("");
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setExcuse("");
        setCopied(false);
        if (!category || !type) return;

        const evtSource = new EventSource(`http://localhost:3000/api/escuses?categorie=${category}&type=${type}`);

        evtSource.onmessage = (event) => {
            if (event.data === "[DONE]") {
                evtSource.close();
                return;
            }

            try {
                const jsonData = JSON.parse(event.data); 
                setExcuse((prev) => prev + (jsonData.message || jsonData));
            } catch {
                setExcuse((prev) => prev + event.data); 
            }
        };

        evtSource.onerror = (event) => {
            console.error("Erreur SSE", event);
            evtSource.close();
        };

        return () => {
            evtSource.close(); 
        };
    }, [category, type]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(excuse);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Erreur lors de la copie", err);
        }
    };

    const handleSaveExcuse = async() =>{
        setIsLoading(true)
        setError("")
        try {
            const response = await fetch("http://localhost:3000/excuses", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "texte": excuse,
                    "type": type,
                    "categorie": category
                }),
                });
                    
                const data = await response.json();

                if (response.ok) {
                    setOpenModal(true);
                }
                else{
                    setError(data.error)
                    setOpenModal(true);
                }
        } catch (error) {
            console.error("Erreur lors de la récupération des types", error);
        }
        setIsLoading(false)
    }

    return (
        <div className="excuse-item-container">
            <div className="excuse-item">{excuse}</div>
            <button className="button-secondary" onClick={handleSaveExcuse} disabled={isLoading}>❤️</button>
            <button onClick={handleCopy} disabled={!excuse} className="copy-button">
                <span>{copied ? <CheckIcon className="h-6 w-6 text-gray-500" /> : <ClipboardDocumentCheckIcon className="h-6 w-6 text-gray-500" />}</span>
            </button>

            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box 
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 300,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        textAlign: "center",
                        color: "black"
                    }}
                >
                    <Typography id="modal-title" variant="h6" component="h2">
                     Enregistrement de l'excuse
                    </Typography>
                    {error === '' ? (
                        <Typography id="modal-description" sx={{ mt: 2 }}>
                        Votre excuse a bien été sauvegardée.
                        </Typography>
                    ): (
                        <Typography id="modal-description" style={{color: 'red'}} sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <Button onClick={() => setOpenModal(false)} variant="contained" sx={{ mt: 3 }}>
                        OK
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};


export default ExcuseItem;
