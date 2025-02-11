import React, { useEffect, useState } from "react";

const ExcuseItem = ({ category, reason }) => {
    const [excuse, setExcuse] = useState("");

    useEffect(() => {
        setExcuse("")
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

    const handleSave = () => {
        console.log("Excuse enregistrée:", excuse);
    };

    return <div className="excuse-item" onClick={handleSave}>{excuse}</div>;
};

export default ExcuseItem;
