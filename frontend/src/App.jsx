import React, { useState } from "react";
import Home from "./pages/Home";
import Favoris from "./pages/Favoris";
import { BrowserRouter, Routes, Route } from "react-router-dom";


const App = () => {

    return (
        <div className="app-container">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/favoris" element={<Favoris />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;