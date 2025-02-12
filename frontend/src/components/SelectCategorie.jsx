import React, { useState, useEffect } from "react";

const SelectCategorie = ({ onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://localhost:3000/categories");
                const data = await response.json();
                setCategories(data.map(item => item.nom));
            } catch (error) {
                console.error("Erreur lors de la récupération des catégories", error);
            }
        };

        fetchCategories();
    }, []);

    const handleSelect = (value) => {
        setSelectedOption(value);
        onSelect(value);
        setIsOpen(false);
    };

    return (
        <div className="select-box-container">
            <div className="select-box" onClick={() => setIsOpen(!isOpen)}>
                {selectedOption || "Quelle catégorie ?"}
                <span className="arrow">▼</span>
            </div>
            {isOpen && (
                <div className="options">
                    {categories.map((category) => (
                        <div key={category} className="option" onClick={() => handleSelect(category)}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SelectCategorie;
