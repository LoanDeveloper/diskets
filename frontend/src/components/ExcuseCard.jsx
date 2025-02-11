import React from 'react';

const ExcuseCard = ({ excuse }) => (
    <div className="excuse-card">
        <p>{excuse.texte}</p>
   </div>
);
 
export default ExcuseCard;