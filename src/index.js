import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Importations CSS
import './index.css';
import 'leaflet/dist/leaflet.css';

// Utilisez une variable d'environnement pour votre Client ID (Recommandé)
// Créez un fichier .env à la racine de votre projet frontend avec :
// REACT_APP_GOOGLE_CLIENT_ID=votre_id_ici
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="1005774354778-1ofhfhmdnioritmako50ktfnadaq0sgd.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

reportWebVitals();