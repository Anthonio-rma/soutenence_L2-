import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, ZoomControl, CircleMarker } from 'react-leaflet';
import { 
  Search, Bell, AlertTriangle, Clock, MapPin, CheckCircle2, RefreshCw, Radio
} from 'lucide-react';

const TANA_CENTER = [-18.9100, 47.5250];

export default function AlertesTrafic() {
  const [filter, setFilter] = useState('all'); // all, retard, arrivee, itinéraire, trafic
  const [searchQuery, setSearchQuery] = useState('');
  const [pushEnabled, setPushEnabled] = useState(true); // Statut notification push mobile

  // Simulation des alertes et notifications intelligentes basées sur les critères demandés
  const alertesList = [
    { 
      id: "A-2930", 
      type: "retard", 
      titre: "Alerte de retard important", 
      ligne: "119", 
      Cooperative: "Taxis-be", 
      message: "Ligne 119 (Charles Davies) accuse un retard de 12 min suite à une forte congestion.", 
      lieu: "Ambanidia Tunnel", 
      temps: "Il y a 2 min", 
      statut: "active",
      position: [-18.9152, 47.5318],
      severite: "high"
    },
    { 
      id: "A-8399", 
      type: "arrivee", 
      titre: "Arrivée imminente du véhicule", 
      ligne: "163", 
      Cooperative: "Mirindra", 
      message: "Le véhicule 163 arrive à son arrêt terminus d'Analakely dans moins de 2 minutes.", 
      lieu: "Analakely Esplanade", 
      temps: "À l'instant", 
      statut: "info",
      position: [-18.9055, 47.5254],
      severite: "low"
    },
    { 
      id: "A-2739", 
      type: "itinéraire", 
      titre: "Changement d'itinéraire temporaire", 
      ligne: "194", 
      Cooperative: "MA-FA", 
      message: "Déviation mise en place via le Pont Ampasika suite à des travaux sur la chaussée.", 
      lieu: "Pont Ampasika", 
      temps: "Il y a 15 min", 
      statut: "active",
      position: [-18.9182, 47.4811],
      severite: "medium"
    },
    { 
      id: "A-8304", 
      type: "trafic", 
      titre: "Information Trafic : Ralentissement", 
      ligne: "137", 
      Cooperative: "Kofia", 
      message: "Embouteillages denses signalés aux abords du marché. Trafif ralenti pour la ligne 137.", 
      lieu: "Isotry Marché", 
      temps: "Il y a 8 min", 
      statut: "active",
      position: [-18.9054, 47.5141],
      severite: "medium"
    },
    { 
      id: "A-7649", 
      type: "arrivee", 
      titre: "Arrivée enregistrée à destination", 
      ligne: "154", 
      Cooperative: "Trans-7", 
      message: "Course terminée. Le véhicule a déposé ses passagers avec succès à Ampandrianomby.", 
      lieu: "Ampandrianomby", 
      temps: "Il y a 20 min", 
      statut: "completed",
      position: [-18.9012, 47.5565],
      severite: "low"
    },
  ];

  // Logique de filtrage par critères et par barre de recherche
  const filteredAlertes = alertesList.filter(alerte => {
    const matchesFilter = filter === 'all' || alerte.type === filter;
    
    const query = searchQuery.toLowerCase();
    const matchesSearch = alerte.id.includes(query) || 
                          alerte.ligne.includes(query) ||
                          alerte.Cooperative.toLowerCase().includes(query) ||
                          alerte.titre.toLowerCase().includes(query) ||
                          alerte.lieu.toLowerCase().includes(query) ||
                          alerte.message.toLowerCase().includes(query);
                          
    return matchesFilter && matchesSearch;
  });

  const countTotal = alertesList.length;

  return (
    <div className="flex-1 h-screen relative flex flex-col font-sans select-none overflow-hidden bg-[#f3f4f6]">
      
      {/* 1. BARRE DE NAVIGATION SUPÉRIEURE ÉLASTIQUE ET RESPONSIVE */}
      <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-[1000] flex flex-row items-start justify-between gap-2 pointer-events-none">
        
        {/* Bulle info Centre d'Alertes et contrôle Push Mobile */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-3 sm:p-4 shadow-xl border border-gray-100 flex flex-col items-center w-40 sm:w-52 pointer-events-auto relative flex-shrink-0"
        >
          <div className="absolute top-2 right-3 text-gray-400 cursor-pointer text-xs font-bold">i</div>
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-indigo-50 border-2 border-white shadow-md overflow-hidden flex items-center justify-center font-bold text-indigo-600 text-xs sm:text-sm mb-1.5">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
          </div>
          <h4 className="text-[10px] sm:text-xs font-bold text-gray-800 text-center truncate w-full leading-none">Notifications Push</h4>
          <div className="flex items-center gap-1 text-gray-500 font-bold text-[8px] sm:text-[10px] mt-1">
            Statut : <span className={pushEnabled ? "text-emerald-600" : "text-gray-400"}>{pushEnabled ? "Actif" : "Inactif"}</span>
          </div>
          
          {/* Bouton d'action adaptatif */}
          <div className="flex items-center gap-2 mt-2 w-full">
            <button 
              onClick={() => setPushEnabled(!pushEnabled)}
              className={`flex-1 py-1 sm:py-2 rounded-xl flex items-center justify-center transition-colors shadow-sm text-white font-bold text-[8px] sm:text-xs gap-1 ${
                pushEnabled ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 hover:bg-gray-500"
              }`}
            >
              <Radio className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span className="truncate">{pushEnabled ? "Couper" : "Activer"}</span>
            </button>
          </div>
        </motion.div>

        {/* Profil utilisateur à droite */}
        <div className="bg-white rounded-xl px-2 py-1 sm:px-2.5 sm:py-1.5 shadow-md border border-gray-100 flex items-center gap-1.5 sm:gap-2 pointer-events-auto flex-shrink-0 max-w-[150px] sm:max-w-none">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-200 flex items-center justify-center font-bold text-[9px] sm:text-[10px] text-gray-700 flex-shrink-0">AL</div>
          <span className="text-[9px] sm:text-[11px] font-bold text-gray-600 truncate">Angela Longoria</span>
          <span className="text-[7px] sm:text-[9px] text-gray-400 flex-shrink-0">▼</span>
        </div>
      </div>

      {/* 2. COMPOSANT CARTE INTERACTIVE EN FOND */}
      <div className="w-full h-full z-0">
        <MapContainer 
          center={TANA_CENTER} 
          zoom={13} 
          zoomControl={false} 
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {/* Points d'incidents d'alertes */}
          {filteredAlertes.map((alerte) => (
            <CircleMarker 
              key={`marker-inc-${alerte.id}`} 
              center={alerte.position} 
              radius={alerte.severite === 'high' ? 14 : 10} 
              pathOptions={{ 
                fillColor: alerte.type === 'retard' ? '#ef4444' : alerte.type === 'arrivee' ? '#10b981' : alerte.type === 'itinéraire' ? '#16a34a' : '#f97316', 
                color: '#fff', 
                weight: 2, 
                fillOpacity: 0.4 
              }} 
            />
          ))}

          <ZoomControl position="topright" />
        </MapContainer>
      </div>

      {/* 3. PANNEAU INFÉRIEUR COULISSANT RENDU PARFAITEMENT FLEXIBLE */}
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white rounded-3xl p-3 sm:p-4 shadow-2xl border border-gray-100/80 z-[1000] flex flex-col gap-3 h-auto max-h-[42vh] sm:max-h-[320px]">
        
        {/* Barre de Filtres et Input de Recherche */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 pb-2 border-b border-gray-50">
          <div className="w-full lg:w-auto overflow-x-auto no-scrollbar -mx-3 px-3 lg:mx-0 lg:px-0">
            <div className="flex rounded-xl p-0.5 bg-gray-100 font-bold text-[10px] sm:text-[11px] w-max">
              <button onClick={() => setFilter('all')} className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${filter === 'all' ? 'bg-[#5b51ef] text-white shadow-sm' : 'text-gray-500'}`}>Tous <span className="opacity-60 ml-0.5">{countTotal}</span></button>
              <button onClick={() => setFilter('retard')} className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${filter === 'retard' ? 'bg-[#5b51ef] text-white shadow-sm' : 'text-gray-500'}`}>Retards</button>
              <button onClick={() => setFilter('arrivee')} className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${filter === 'arrivee' ? 'bg-[#5b51ef] text-white shadow-sm' : 'text-gray-500'}`}>Arrivées</button>
              <button onClick={() => setFilter('itinéraire')} className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${filter === 'itinéraire' ? 'bg-[#5b51ef] text-white shadow-sm' : 'text-gray-500'}`}>Itinéraires</button>
              <button onClick={() => setFilter('trafic')} className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${filter === 'trafic' ? 'bg-[#5b51ef] text-white shadow-sm' : 'text-gray-500'}`}>Infos Trafic</button>
            </div>
          </div>

          {/* Recherche réactive d'incidents */}
          <div className="relative w-full lg:w-64 mt-1 lg:mt-0">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une alerte ou une ligne..." 
              className="w-full pl-8 pr-4 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-[11px] focus:outline-none font-medium text-gray-700"
            />
          </div>
        </div>

        {/* CONTENU DU BENTO (Grille défilante horizontale des fiches d'alertes) */}
        <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-1 flex-1 items-stretch">
          <AnimatePresence mode="popLayout">
            {filteredAlertes.map((alerte) => (
              <motion.div 
                key={alerte.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                className={`min-w-[240px] sm:min-w-[280px] max-w-[320px] bg-white border border-gray-100 p-3 rounded-2xl flex flex-col justify-between shadow-sm relative flex-shrink-0 ${
                  alerte.type === "retard" ? "border-l-2 border-l-rose-500" : "border-l-2 border-l-indigo-500"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-gray-800 flex items-center gap-1">
                      {alerte.type === 'retard' ? <AlertTriangle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" /> : alerte.type === 'arrivee' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> : <RefreshCw className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                      <span className="truncate">Ligne {alerte.ligne}</span>
                    </span>
                    <span className={`text-[8px] sm:text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase flex-shrink-0 ${
                      alerte.type === 'retard' ? 'bg-rose-50 text-rose-600' : alerte.type === 'arrivee' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {alerte.type}
                    </span>
                  </div>

                  {/* Message descriptif de la notification */}
                  <div className="mt-2 flex flex-col gap-0.5 sm:gap-1">
                    <h5 className="text-[10px] sm:text-[11px] font-bold text-gray-800 leading-tight line-clamp-1">{alerte.titre}</h5>
                    <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium leading-normal line-clamp-2">{alerte.message}</p>
                  </div>
                </div>

                {/* Pied de la fiche d'alerte */}
                <div className="border-t border-gray-50 pt-2 mt-2 flex items-center justify-between text-[9px] sm:text-[10px] font-bold text-gray-400">
                  <span className="text-gray-700 font-extrabold truncate pr-2 flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" /> <span className="truncate">{alerte.lieu}</span>
                  </span>
                  <span className="flex items-center gap-1 flex-shrink-0">
                    <Clock className="w-3" /> {alerte.temps}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}