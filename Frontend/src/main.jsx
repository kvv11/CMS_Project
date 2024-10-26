import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import Odabir from './components/Odabir';
import DodajClanak from './components/DodajClanak';
import UrediClanak from './components/UrediClanak';
import Profil from './components/Profil'; 
import Navigacija from './components/Navigacija'; 
import './index.css'; 

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Router>
    <div>
      <Navigacija /> 
      <Routes>
        <Route path="/login" element={<Login />} /> 
        <Route path="/logout" element={<Logout />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/odabir" element={<Odabir />} /> 
        <Route path="/dodaj-clanak" element={<DodajClanak />} /> 
        <Route path="/uredi-clanak/:id" element={<UrediClanak />} /> 
        <Route path="/profil/:id" element={<Profil />} /> 
        <Route path="/*" element={<App />} /> 
      </Routes>
    </div>
  </Router>
);
