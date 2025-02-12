import React, { useEffect, useState } from "react";
import { ClipboardDocumentCheckIcon, CheckIcon } from "@heroicons/react/24/solid";
import { Modal, Box, Typography, Button } from "@mui/material";

const ExcuseItem = ({ category, type }) => {
    const [excuse, setExcuse] = useState("");
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);

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

    

    return (
        <div className="excuse-item-container">
            <div className="excuse-item">{excuse}</div>
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
                        textAlign: "center"
                    }}
                >
                    <Typography id="modal-title" variant="h6" component="h2">
                        Excuse enregistrée !
                    </Typography>
                    <Typography id="modal-description" sx={{ mt: 2 }}>
                        Votre excuse a bien été sauvegardée.
                    </Typography>
                    <Button onClick={() => setOpenModal(false)} variant="contained" sx={{ mt: 3 }}>
                        OK
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};


export default ExcuseItem;
