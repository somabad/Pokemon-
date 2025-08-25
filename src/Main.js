import React, { StrictMode } from "react";
import ReactDOM, { createRoot } from 'react-dom/client';
import App from './App.js';
import './css/index.css';
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
        <App/>
        </BrowserRouter>
    </StrictMode>
);