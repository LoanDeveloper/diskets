import React, { useState, useEffect } from "react";
import TextEditorWithSuggestions from './TextEditorWithSuggestions';

const SelectType = ({ onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [types, setTypes] = useState([]);

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const response = await fetch("http://localhost:3000/types");
                const data = await response.json();
                setTypes(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des types", error);
            }
        };

        fetchTypes();
    }, []);

    const handleSelect = (value) => {
        setSelectedOption(value);
        onSelect(value);
        setIsOpen(false);
    };

    return (
        <div className="select-box-container">
                <TextEditorWithSuggestions 
                    suggestions={types?.map((category) => {return category?.texte})} 
                    onTextSelect={handleSelect} 
                    label="Type"
                />
        </div>
    );
};

export default SelectType;
