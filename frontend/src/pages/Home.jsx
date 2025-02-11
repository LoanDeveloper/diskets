import React, { useState } from "react";
import SelectCategory from "../components/SelectCategory";
import SelectReason from "../components/SelectReason";
import ExcuseList from "../components/ExcuseList";
import { fetchExcuses } from "../services/api";

const Home = () => {
    const [category, setCategory] = useState("");
    const [reason, setReason] = useState("");
    const [excuses, setExcuses] = useState([]);

    const handleGenerate = async () => {
        if (category && reason) {
            const generatedExcuses = await fetchExcuses(category, reason);
            setExcuses(generatedExcuses);
        }
    };

    return (
        <div className="home-container">
            <h1>Diskets</h1>
            <p>Tu ne sais pas quoi inventer comme excuse ? Nous sommes là pour ça !</p>
            <div className="select-container">
                <SelectCategory onSelect={setCategory} />
                <SelectReason onSelect={setReason} />
                <button className="generate-button" onClick={handleGenerate}>Générer</button>
            </div>
            <ExcuseList excuses={excuses} />
        </div>
    );    
};

export default Home;