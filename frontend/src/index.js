import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createRoot } from 'react-dom/client';


const root = document.getElementById('root');

createRoot(root).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
