import React, { useState } from 'react';
import { Modal, Box, Typography, Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
const AddCategorieModal = ({ openModal,  closeModal}) => {

    const [nom, setNom] = useState("")
    const handleAddCategory = async() => {
        try {
            const response = await fetch("http://localhost:3000/categories", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "nom": nom,
                }),
                });
                if (response.ok) {
                    setNom("")
                    closeModal();
                }
            const data = await response.json();
        } catch (error) {
            console.error("Erreur lors de la récupération des types", error);
        }
    }




    return (
        <Modal
            open={openModal}
            onClose={() => closeModal()}
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
                    <div>
                        <TextField
                        label="Nom de la catétegorie"
                        value={nom}
                        onChange={(event) => setNom(event.target.value)}
                        />
                    </div>
                    <Button onClick={() => handleAddCategory()} variant="contained" sx={{ mt: 3 }}>
                        Ajouter
                    </Button>
                </Box>
        </Modal>
)};
 
export default AddCategorieModal;