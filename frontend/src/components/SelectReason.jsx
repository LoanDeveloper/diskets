import React from "react";

const SelectReason = ({ onSelect }) => {
    return (
        <select className="select-box" onChange={(e) => onSelect(e.target.value)}>
            <option value="">Sélectionner une raison</option>
            <option value="famille">Famille</option>
            <option value="amis">Amis</option>
            <option value="ecole">École</option>
            <option value="travail">Travail</option>
            <option value="divers">Divers</option>
        </select>
    );
};

export default SelectReason;
