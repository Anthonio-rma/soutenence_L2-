import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Importations des pages
import LandingPage from './pages/Landing_Page';
import LoginRegisterPage from './pages/login_et_registe_page';
import MainLayout from './layouts/MainLayout';
import PageUtilisateur from './pages/page_utilisateur';
import PageAlert from './pages/alerte_trafic';
import Pageconfig from './pages/configuration';
import SuiviGps from './pages/suivi_gps';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Routes Publiques */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginRegisterPage />} />

        {/* 2. Routes Protégées / Dashboard (Imbriquées dans MainLayout) */}
        {/* Note : Toutes les routes ici auront une URL de type /dashboard/... */}
        <Route path="/dashboard" element={<MainLayout />}>
          
          {/* Index : correspond à /dashboard */}
          <Route index element={<PageUtilisateur />} />

          {/* Sous-pages */}
          <Route path="carte-temps-reel" element={<SuiviGps />} />
          <Route path="alert_trafic" element={<PageAlert />} />
          <Route path="configuration" element={<Pageconfig />} />
          
          {/* Autres sections */}
          <Route path="lignes" element={<div className="p-4">Lignes & Horaires</div>} />
          <Route path="arrets" element={<div className="p-4">Arrêts de Bus</div>} />
          <Route path="vehicules" element={<div className="p-4">Flotte Véhicules</div>} />
          <Route path="analyses" element={<div className="p-4">Flux & Mobilité</div>} />

          {/* Redirection si un utilisateur va sur un chemin inexistant sous /dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Catch-all : si l'URL ne correspond à rien du tout */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;