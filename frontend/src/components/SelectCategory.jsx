import React from "react";

const SelectCategory = ({ onSelect }) => {
    return (
        <select className="select-box" onChange={(e) => onSelect(e.target.value)}>
            <option value="">Sélectionner une catégorie</option>
            <option value="retard">Retard</option>
            <option value="absence">Absence</option>
        </select>
    );
};

export default SelectCategory;
