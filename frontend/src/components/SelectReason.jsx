import React, { useState } from "react";

const SelectReason = ({ onSelect }) => {
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
                {selectedOption || "Quelle raison ?"}
                <span className="arrow">▼</span>
            </div>
            {isOpen && (
                <div className="options">
                    {["famille", "amis", "ecole", "travail", "divers"].map((option) => (
                        <div key={option} className="option" onClick={() => handleSelect(option)}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SelectReason;
