import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router'; // React Router v7
import './App.css';

// Importations des pages de base
import LandingPage from './pages/Landing_Page';
import LoginRegisterPage from './pages/login_et_registe_page';
import MainLayout from './layouts/MainLayout';
import PageUtilisateur from './pages/page_utilisateur';
import PageAlert from './pages/alerte_trafic';

// 1. VÉRIFIE BIEN CET IMPORT (Le nom du fichier est suivi_gps.js)
import SuiviGps from './pages/suivi_gps'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages publiques */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginRegisterPage />} />

        {/* Espace Connecté TAXI-BE */}
        <Route path="/dashboard" element={<MainLayout />}>
          {/* Quand on est sur /dashboard -> on affiche la vue d'ensemble */}
          <Route index element={<PageUtilisateur />} />

          {/* 2. C'EST CETTE LIGNE QUI FAIT LA MAGIE POUR /dashboard/carte-temps-reel */}
          <Route path="carte-temps-reel" element={<SuiviGps />} />
          <Route path="alert_trafic" element={<PageAlert />} />

          {/* Les autres sous-pages de ton menu */}
          <Route path="lignes" element={<div className="p-4">Lignes & Horaires</div>} />
          <Route path="arrets" element={<div className="p-4">Arrêts de Bus</div>} />
          <Route path="vehicules" element={<div className="p-4">Flotte Véhicules</div>} />
          <Route path="alertes" element={<div className="p-4">Alertes Trafic</div>} />
          <Route path="analyses" element={<div className="p-4">Flux & Mobilité</div>} />
          <Route path="configuration" element={<div className="p-4">Configuration</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;