import React, { useEffect, useState } from "react";
import SelectCategory from "../components/SelectCategory";
import SelectReason from "../components/SelectReason";
import ExcuseList from "../components/ExcuseList";

import ExcuseItem from "../components/ExcuseItem"

const Home = () => {
    const [category, setCategory] = useState("");
    const [reason, setReason] = useState("");

    const [isGenerating, setIsGenerating] = useState(false);


    const handleGenerate =  () => {
        if (category && reason) {
            setIsGenerating(true);
        }
    };

    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory);
        setIsGenerating(false);
    };

    const handleReasonChange = (newReason) => {
        setReason(newReason);
        setIsGenerating(false);
    };

    return (
        <div className="home-container">
            <h1>Diskets</h1>
            <p>Tu ne sais pas quoi inventer comme excuse ? Nous sommes là pour ça !</p>
            <div className="select-container">
                <SelectCategory  onSelect={handleCategoryChange} />
                <SelectReason onSelect={handleReasonChange} />
                <button className="generate-button" onClick={()=> handleGenerate()}>
                    {isGenerating ? (
                        <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                            <rect x="6" y="6" width="12" height="12" />
                        </svg>
                    ) : (
                        <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                            <path d="M12 4l-8 8h6v8h4v-8h6z" />
                        </svg>
                    )}
                </button>
            </div>
            

            {(category && reason && isGenerating) && (
                <>
                    <ExcuseItem category={category} reason={reason} isGenerating={isGenerating}/>
                    <ExcuseItem category={category} reason={reason} isGenerating={isGenerating}/>
                    <ExcuseItem category={category} reason={reason} isGenerating={isGenerating}/>
                </>
            )}
                
        
        </div>
    );    
};

export default Home;
