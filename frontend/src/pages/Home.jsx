import React, { useEffect, useState } from "react";
import SelectType from "../components/SelectType";
import SelectCategorie from "../components/SelectCategorie";
import ExcuseItem from "../components/ExcuseItem"
import AddCategorieModal from "../components/AddCategorieModal";

const Home = () => {
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");

    const [showAddCategorieModal, setShowAddCategorieModal] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light"; 
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const handleGenerate =  () => {
        if (category.trim() !== "" && type.trim() !== "") {
            setIsGenerating(true);
        }
    };

    const handleTypeChange = (type) => {
        setType(type);
        setIsGenerating(false);
    };

    const handleCategorieChange = (categorie) => {
        setCategory(categorie);
        setIsGenerating(false);
    };

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <div className="home-container">
            <button className="theme-toggle-button" onClick={toggleTheme}>
                {theme === "light" ? "🌙 Mode sombre" : "☀️ Mode clair"}
            </button>
            <h1>Diskets</h1>
            <p>Tu ne sais pas quoi inventer comme excuse ? Nous sommes là pour ça !</p>

            <div className="select-container">
                <div id="input-select">
                    <SelectType onSelect={handleTypeChange} />
                    <SelectCategorie onSelect={handleCategorieChange} />
                </div>
                <button className="generate-button" onClick={() => handleGenerate()}>
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

            {(category && type && isGenerating) && (
                <div className="excuse-list">
                    <ExcuseItem category={category} type={type} isGenerating={isGenerating}/>
                    <ExcuseItem category={category} type={type} isGenerating={isGenerating}/>
                    <ExcuseItem category={category} type={type} isGenerating={isGenerating}/>
                </div>
            )}

            <AddCategorieModal openModal={showAddCategorieModal} closeModal={() => setShowAddCategorieModal(false)} />
        </div>
    );
};

export default Home;
