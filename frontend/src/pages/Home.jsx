import React, { useState } from "react";
import SelectCategory from "../components/SelectCategory";
import SelectReason from "../components/SelectReason";
import ExcuseList from "../components/ExcuseList";
import { fetchExcuses } from "../services/api";

const Home = () => {
    const [category, setCategory] = useState("");
    const [reason, setReason] = useState("");
    const [excuses, setExcuses] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (category && reason) {
            setIsGenerating(true);
            setExcuses([]);
            const generatedExcuses = await fetchExcuses(category, reason);
            setExcuses(generatedExcuses);
            setIsGenerating(false);
        }
    };

    return (
        <div className="main">
            <header className="main-header">
                <h1>Diskets</h1>
                <p>Tu ne sais pas quoi inventer comme excuse ? Nous sommes là pour ça !</p>
            </header>
            <div className="home-container">
                <div className="select-container">
                    <SelectCategory onSelect={setCategory} />
                    <SelectReason onSelect={setReason} />
                    <button className="generate-button" onClick={handleGenerate}>
                        {isGenerating ? (
                            <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <rect x="6" y="6" width="13" height="13" />
                            </svg>
                        ) : (
                            <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M12 4l-8 8h6v8h4v-8h6z" />
                            </svg>
                        )}
                    </button>
                </div>
                {isGenerating ? (
                    <div className="excuse-list">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="skeleton"></div>
                        ))}
                    </div>
                ) : (
                    <ExcuseList excuses={excuses} />
                )}
            </div>
        </div>
    );
};

export default Home;
