import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import {BrowserRouter} from "react-router-dom";

// Apply saved theme to <html> before app mounts so DaisyUI themes render correctly
try {
    const theme = localStorage.getItem('chat-theme') || 'coffee';
    document.documentElement.setAttribute('data-theme', theme);
    document.body && document.body.setAttribute('data-theme', theme);
} catch (err) {
    // ignore in non-browser environments
}

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)
