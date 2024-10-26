import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigacija from './components/Navigacija';
import Glavna from './components/Glavna';
import Clanak from './components/Clanak';
import UrediClanak from './components/UrediClanak';
import Profil from './components/Profil';
import DodajNovinara from './components/DodajNovinara';
import './App.css';
import Korisnici from './components/Korisnici';

function App() {
  return (
    <div className="App">
      <Navigacija />
      <Routes>
        <Route path="/" element={<Glavna />} />
        <Route path="/clanak/:id" element={<Clanak />} />
        <Route path="/uredi-clanak/:id" element={<UrediClanak />} />
        <Route path="/profil/:id" element={<Profil />} />
        <Route path="/dodaj-novinara" element={<DodajNovinara />} />
        <Route path="/korisnici" element={<Korisnici />} />
      </Routes>
    </div>
  );
}

export default App;
