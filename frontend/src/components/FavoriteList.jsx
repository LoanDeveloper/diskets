import React, { useState, useEffect } from "react";
import { ClipboardDocumentCheckIcon, CheckIcon } from "@heroicons/react/24/solid";

const FavoriteList = () => {
    const [favoris, setFavoris] = useState([]);
    const [copiedId, setCopiedId] = useState(null);

    const handleCopy = async (text, id) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error("Erreur lors de la copie", err);
        }
    };

    useEffect(() => {
        const fetchExcuses = async () => {
            try {
                const response = await fetch("http://localhost:3000/excuses");
                const data = await response.json();
                setFavoris(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des excuses favorites", error);
            }
        };

        fetchExcuses();
    }, []);

    return (
        <div className="excuse-list-container">
            <div className="excuse-list">
                {favoris.map((favori) => (
                    <div className="excuse-item-container" key={favori.id}>
                        <div className="excuse-item">{favori.texte}</div>
                        <button onClick={() => handleCopy(favori.texte, favori.id)} className="copy-button p-2 flex items-center justify-center">
                            <span>
                                {copiedId === favori.id ? (
                                    <CheckIcon className="h-6 w-6 text-green-500" />
                                ) : (
                                    <ClipboardDocumentCheckIcon className="h-6 w-6 text-gray-500" />
                                )}
                            </span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FavoriteList;
