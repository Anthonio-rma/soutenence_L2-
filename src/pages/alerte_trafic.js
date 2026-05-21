import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, ZoomControl, CircleMarker } from 'react-leaflet';
import { Search, Bell, AlertTriangle, Clock, MapPin, CheckCircle2, RefreshCw, Radio } from 'lucide-react';

const TANA_CENTER = [-18.9100, 47.5250];

export default function AlertesTrafic() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pushEnabled, setPushEnabled] = useState(true);

  // ... (votre constante alertesList reste identique) ...
  const alertesList = [ /* ... vos données ... */ ];

  const filteredAlertes = alertesList.filter(alerte => {
    const matchesFilter = filter === 'all' || alerte.type === filter;
    const query = searchQuery.toLowerCase();
    return matchesFilter && (alerte.id.includes(query) || alerte.ligne.includes(query) || alerte.Cooperative.toLowerCase().includes(query) || alerte.titre.toLowerCase().includes(query) || alerte.lieu.toLowerCase().includes(query) || alerte.message.toLowerCase().includes(query));
  });

  return (
    <div className="flex-1 h-screen relative flex flex-col font-sans select-none overflow-hidden bg-[#f3f4f6]">
      {/* 1. BARRE DE NAVIGATION SUPÉRIEURE */}
      <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-[1000] flex flex-row items-start justify-between gap-2 pointer-events-none">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-3 shadow-xl border border-gray-100 flex flex-col items-center w-40 pointer-events-auto">
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-1.5">
            <Bell className="w-4 h-4 animate-pulse" />
          </div>
          <button onClick={() => setPushEnabled(!pushEnabled)} className={`px-3 py-1 rounded-lg text-[10px] font-bold text-white ${pushEnabled ? "bg-indigo-600" : "bg-gray-400"}`}>
            {pushEnabled ? "Couper Push" : "Activer Push"}
          </button>
        </motion.div>
      </div>

      {/* 2. CARTE */}
      <div className="w-full h-full z-0">
        <MapContainer center={TANA_CENTER} zoom={13} zoomControl={false} className="w-full h-full">
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          {filteredAlertes.map((alerte) => (
            <CircleMarker key={alerte.id} center={alerte.position} radius={10} pathOptions={{ fillColor: '#5b51ef', color: '#fff' }} />
          ))}
          <ZoomControl position="topright" />
        </MapContainer>
      </div>

      {/* 3. PANNEAU INFÉRIEUR */}
      <div className="absolute bottom-20 md:bottom-4 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white rounded-3xl p-4 shadow-2xl z-[900] flex flex-col gap-3 h-auto max-h-[40vh]">
        <input type="text" onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher..." className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs" />
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['all', 'retard', 'arrivee', 'itinéraire', 'trafic'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-lg text-[10px] font-bold ${filter === f ? 'bg-[#5b51ef] text-white' : 'bg-gray-100'}`}>{f.toUpperCase()}</button>
          ))}
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {filteredAlertes.map((a) => (
            <div key={a.id} className="min-w-[240px] bg-white border border-gray-100 p-3 rounded-2xl shadow-sm border-l-4 border-l-indigo-500">
              <h5 className="text-[11px] font-bold text-gray-800">{a.titre}</h5>
              <p className="text-[10px] text-gray-500">{a.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}