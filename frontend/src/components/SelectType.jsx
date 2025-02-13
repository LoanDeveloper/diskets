import React, { useState, useEffect } from "react";

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
        console.log(value);
    };

    return (
        <div className="select-box-container">
            <div className="select-box" onClick={() => setIsOpen(!isOpen)}>
                {selectedOption?.texte || "Quel type ?"}
                <span className="arrow">▼</span>
            </div>
            {isOpen && (
                <div className="options">
                    {types.map((option) => (
                        <div 
                            key={option?.id} 
                            className="option" 
                            onClick={() => handleSelect(option)}
                        >
                            {option?.texte.charAt(0).toUpperCase() + option.texte.slice(1)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SelectType;
