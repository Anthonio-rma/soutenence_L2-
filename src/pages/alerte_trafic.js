import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, ZoomControl, CircleMarker } from 'react-leaflet';
import { AlertTriangle, Clock, CheckCircle2, Navigation2, Radio } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const TANA_CENTER = [-18.9100, 47.5250];

const alertesList = [
  { id: '1', type: 'retard', titre: 'Ligne 119', message: 'Retard de 12 min à Ankatso', position: [-18.9168, 47.5552] },
  { id: '2', type: 'arrivee', titre: 'Ligne 194', message: 'Arrivée imminente à Ankorondrano', position: [-18.8812, 47.5311] },
  { id: '3', type: 'itineraire', titre: 'Ligne 163', message: 'Déviation temporaire via Ivato', position: [-18.7994, 47.4789] },
  { id: '4', type: 'trafic', titre: 'Analakely', message: 'Trafic très dense, ralentissement', position: [-18.9055, 47.5254] },
];

export default function AlertesTrafic() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pushEnabled, setPushEnabled] = useState(true);

  const filterLabels = {
    all: 'TOUS',
    retard: 'RETARD',
    arrivee: 'ARRIVÉE',
    itineraire: 'ITINÉRAIRE',
    trafic: 'TRAFIC'
  };

  const filteredAlertes = alertesList.filter(alerte => {
    const matchesFilter = filter === 'all' || alerte.type === filter;
    const query = searchQuery.toLowerCase();
    return matchesFilter && (alerte.titre.toLowerCase().includes(query) || alerte.message.toLowerCase().includes(query));
  });

  return (
    <div className="flex-1 h-screen relative flex flex-col font-sans select-none overflow-hidden bg-[#f3f4f6]">
      
      {/* 1. BARRE DE NAVIGATION SUPÉRIEURE */}
      <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-[10] flex justify-between items-start pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white rounded-2xl p-3 shadow-xl border border-gray-100 flex flex-col items-center w-40 pointer-events-auto"
        >
          <div className="flex items-center gap-2 mb-2">
            <Radio className={`w-4 h-4 ${pushEnabled ? 'text-indigo-600 animate-pulse' : 'text-gray-300'}`} />
            <span className="text-[10px] font-bold text-gray-700 uppercase">
              {pushEnabled ? 'PUSH ON' : 'PUSH OFF'}
            </span>
          </div>
          <button 
            onClick={() => setPushEnabled(!pushEnabled)} 
            className={`w-full py-1.5 rounded-lg text-[10px] font-bold text-white transition-colors ${pushEnabled ? "bg-indigo-600" : "bg-gray-400"}`}
          >
            {pushEnabled ? "Désactiver Alertes" : "Activer Alertes"}
          </button>
        </motion.div>
      </div>

      {/* 2. CARTE */}
      <div className="w-full h-full z-0 absolute inset-0">
        <MapContainer center={TANA_CENTER} zoom={13} zoomControl={false} className="w-full h-full">
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          {filteredAlertes.map((a) => (
            <CircleMarker key={a.id} center={a.position} radius={10} pathOptions={{ fillColor: '#5b51ef', color: '#fff' }} />
          ))}
          <ZoomControl position="topright" />
        </MapContainer>
      </div>

      {/* 3. PANNEAU INFÉRIEUR */}
      <div className="absolute bottom-20 md:bottom-4 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white rounded-3xl p-4 shadow-2xl z-[10] flex flex-col gap-3 h-auto max-h-[40vh]">
        
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
          Informations du jour
        </h3>

        <input 
          type="text" 
          onChange={(e) => setSearchQuery(e.target.value)} 
          placeholder="Rechercher une alerte..." 
          className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs" 
        />
        
        {/* Amélioration de l'emplacement : Utilisation d'une grille pour un alignement parfait */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 w-full">
          {Object.keys(filterLabels).map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)} 
              className={`px-2 py-2 rounded-xl text-[9px] font-bold uppercase transition-all duration-200 border ${
                filter === f 
                  ? 'bg-[#5b51ef] text-white border-[#5b51ef] shadow-md' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-2">
          <AnimatePresence>
            {filteredAlertes.map((a) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }}
                key={a.id} 
                className="min-w-[240px] bg-white border border-gray-100 p-3 rounded-2xl shadow-sm border-l-4 border-l-indigo-500 flex items-center gap-3"
              >
                <div className="text-indigo-600">
                  {a.type === 'retard' && <Clock className="w-5 h-5" />}
                  {a.type === 'arrivee' && <CheckCircle2 className="w-5 h-5" />}
                  {a.type === 'itineraire' && <Navigation2 className="w-5 h-5" />}
                  {a.type === 'trafic' && <AlertTriangle className="w-5 h-5" />}
                </div>
                <div>
                  <h5 className="text-[11px] font-bold text-gray-800">{a.titre}</h5>
                  <p className="text-[10px] text-gray-500">{a.message}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}