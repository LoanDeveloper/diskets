import React, { useEffect, useState } from "react";
import { ClipboardDocumentCheckIcon, CheckIcon } from "@heroicons/react/24/solid";

const ExcuseItem = ({ category, reason }) => {
    const [excuse, setExcuse] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setExcuse("");
        setCopied(false);
        if (!category || !reason) return;

        const evtSource = new EventSource(`http://localhost:3000/api/escuses?categorie=${category}&type=${reason}`);

        evtSource.onmessage = (event) => {
            if (event.data === "[DONE]") {
                evtSource.close();
                return;
            }

            try {
                const jsonData = JSON.parse(event.data); 
                setExcuse((prev) => prev + (jsonData.message || jsonData));
            } catch {
                setExcuse((prev) => prev + event.data); 
            }
        };

        evtSource.onerror = (event) => {
            console.error("Erreur SSE", event);
            evtSource.close();
        };

        return () => {
            evtSource.close(); 
        };
    }, [category, reason]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(excuse);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Erreur lors de la copie", err);
        }
    };

    return (
        <div className="excuse-item-container">
            <div className="excuse-item">{excuse}</div>
            <button onClick={handleCopy} disabled={!excuse} className="copy-button">
                <span>{copied ? <CheckIcon className="h-6 w-6 text-gray-500" /> : <ClipboardDocumentCheckIcon className="h-6 w-6 text-gray-500" />}</span>
            </button>
        </div>
    );
};


export default ExcuseItem;
