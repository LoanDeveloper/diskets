import React from "react";

const ExcuseItem = ({ excuse }) => {
    const handleSave = () => {
        console.log("Excuse enregistrée:", excuse);
    };

    return (
        <div className="excuse-item" onClick={handleSave}>
            {excuse}
        </div>
    );
};

export default ExcuseItem;