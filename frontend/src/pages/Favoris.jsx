import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FavoriteList from "../components/FavoriteList";

const Favoris = () => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light"; 
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);


    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <div className="home-container">
            <div className="header">
                <button className="header-button" onClick={toggleTheme}>
                    {theme === "light" ? "🌙" : "☀️"}
                </button>
                <Link to="/" className="header-button">⌂</Link>
            </div>
            
            <h1>Diskets</h1>
            <p>Tu ne sais pas quoi inventer comme excuse ? Nous sommes là pour ça !</p>

            <div className="favoris">
                <h2>Favoris</h2>
                <FavoriteList />
            </div>
        </div>
    );
};

export default Favoris;
