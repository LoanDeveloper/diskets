import React, { useState } from "react";

const SelectCategory = ({ onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");

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
                    {["retard", "absence"].map((option) => (
                        <div key={option} className="option" onClick={() => handleSelect(option)}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SelectCategory;
