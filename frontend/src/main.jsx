import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Koszyk from './koszyk/Koszyk.jsx'
import Register from "./register/App.jsx";
import Creator from './creator/Creator.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/koszyk" element={<Koszyk />} />
        <Route path="/register" element={<Register />} />
        <Route path="/creator" element={<Creator />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)