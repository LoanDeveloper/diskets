import React from "react";
import ExcuseItem from "./ExcuseItem";

const ExcuseList = ({ excuses }) => {
    return (
        <div className="excuse-list">
            {excuses.map((excuse, index) => (
                <ExcuseItem key={index} excuse={excuse} />
            ))}
        </div>
    );
};

export default ExcuseList;