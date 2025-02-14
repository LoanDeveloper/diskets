import React, { useState, useEffect } from "react";
import { ClipboardDocumentCheckIcon, CheckIcon } from "@heroicons/react/24/solid";

const FavoriteList = () => {
    const [favoris, setFavoris] = useState([]);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(excuse);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Erreur lors de la copie", err);
        }
    };

    useEffect(() => {
        setCopied(false);

        const fetchTypes = async () => {
            try {
                const response = await fetch("http://localhost:3000/excuses");
                const data = await response.json();
                setFavoris(data);
                console.log(favoris);
            } catch (error) {
                console.error("Erreur lors de la récupération des excuses favorites", error);
            }
        };

        fetchTypes();
    }, []);

    return (
        <div className="excuse-list">
                {favoris.map((favori) => (
                    <div className="excuse-item-container">
                        <div className="excuse-item">{favori.texte}</div>
                        <button onClick={handleCopy} className="copy-button">
                            <span>{copied ? <CheckIcon className="h-6 w-6 text-gray-500" /> : <ClipboardDocumentCheckIcon className="h-6 w-6 text-gray-500" />}</span>
                        </button>
                    </div>
                ))}
        </div>
        
    );
};

export default FavoriteList;
