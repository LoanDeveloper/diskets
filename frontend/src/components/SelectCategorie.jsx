import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import TextEditorWithSuggestions from './TextEditorWithSuggestions';


const SelectCategorie = ({ onSelect }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://localhost:3000/categories");
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des catégories", error);
            }
        };

        fetchCategories();
    }, []);


    const handleTextSelect = (selectedText) => {
        setSelectedOption(selectedText); 
        onSelect(selectedText);  
    };
    return (
        <div className="select-box-container">
            <label>
                Catégorie
                <TextEditorWithSuggestions 
                    suggestions={categories?.map((category) => {return category?.nom})} 
                    onTextSelect={handleTextSelect} 
                    label="Catégorie"
                />
            </label>
            
        </div>
    );
};

export default SelectCategorie;
