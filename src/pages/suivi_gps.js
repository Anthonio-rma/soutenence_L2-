import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { 
  Search, Phone, MessageSquare, AlertTriangle, Clock, MapPin
} from 'lucide-react';

import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// --- TRACÉS URBAINS RÉELS ET PRÉCIS D'ANTANANARIVO ---
// Ligne 119 : Ankatso -> Ambanidia -> Tunnel d'Ambohidahy -> Analakely -> 67Ha
const ROUTE_119 = [
  [-18.9168, 47.5552], [-18.9195, 47.5485], [-18.9181, 47.5412], 
  [-18.9152, 47.5318], [-18.9105, 47.5255], [-18.9082, 47.5221], 
  [-18.9051, 47.5182], [-18.9088, 47.5115], [-18.9122, 47.5061]
];

// Ligne 163 : Ivato Aéroport -> Route de la Digue -> Talatamaty -> Ankazomanga -> Analakely
const ROUTE_163 = [
  [-18.7994, 47.4789], [-18.8251, 47.4812], [-18.8415, 47.4764], 
  [-18.8650, 47.4892], [-18.8821, 47.5041], [-18.8912, 47.5145], 
  [-18.9011, 47.5192], [-18.9055, 47.5254]
];

// Ligne 194 : Itaosy -> Ampasika -> Ampefiloha -> Analakely -> Ankorondrano
const ROUTE_194 = [
  [-18.9154, 47.4641], [-18.9182, 47.4811], [-18.9145, 47.4952], 
  [-18.9112, 47.5114], [-18.9091, 47.5215], [-18.9055, 47.5254], 
  [-18.8951, 47.5278], [-18.8812, 47.5311]
];

// Ligne 137 : Vasacos -> Isotry -> Petite Vitesse -> Anosy -> Tanjombato
const ROUTE_137 = [
  [-18.9015, 47.5112], [-18.9054, 47.5141], [-18.9092, 47.5175], 
  [-18.9144, 47.5191], [-18.9252, 47.5214], [-18.9381, 47.5262], 
  [-18.9525, 47.5311]
];

// Ligne 154 : Mahamasina -> Anosy -> Tunnel d'Ambanidia -> Mausolée -> Ampandrianomby
const ROUTE_154 = [
  [-18.9185, 47.5224], [-18.9142, 47.5201], [-18.9151, 47.5312], 
  [-18.9168, 47.5415], [-18.9115, 47.5482], [-18.9052, 47.5514], 
  [-18.9012, 47.5565]
];

const TANA_CENTER = [-18.9100, 47.5250];

// Génération de marqueurs bicolores fluides pour la carte
const createBusIcon = (ligne, primaryColor, secondaryColor) => {
  return L.divIcon({
    className: 'custom-bus-marker',
    html: `
      <div style="position: relative; width: 32px; height: 32px;">
        <svg viewBox="0 0 24 24" width="32" height="32" style="filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3));">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${primaryColor}"/>
        </svg>
        <div style="
          position: absolute; 
          top: 5px; 
          left: 5px; 
          width: 22px; 
          height: 22px; 
          background: ${secondaryColor}; 
          border: 2px solid ${primaryColor};
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-family: sans-serif;
          font-size: 9px; 
          font-weight: 900; 
          color: ${primaryColor === '#ffffff' || primaryColor === '#facc15' ? '#000000' : '#ffffff'};
        ">
          ${ligne}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowUrl: iconShadow,
    shadowSize: [41, 41],
    shadowAnchor: [13, 41]
  });
};

export default function SuiviGps() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [taxiBeList, setTaxiBeList] = useState([
    { 
      id: "2930", 
      chauffeur: "Charles Davies", 
      ligne: "119", 
      statut: "delayed", 
      retard: "12 MIN DE RETARD", 
      Cooperative: "Taxis-be", 
      route: ROUTE_119,
      currentIdx: 0,
      position: ROUTE_119[0], 
      colors: { primary: '#ef4444', secondary: '#ffffff' },
      depart: "Ankatso", 
      etape: "Ambanidia Tunnel", 
      destination: "67Ha Centre",
      arrets: ["Ankatso", "Ambanidia", "Analakely", "67Ha"],
      horaires: { depart: "06:00", arrivee: "07:30" },
      historique: [[-18.9168, 47.5552]],
      suggestions: "Passer par le tunnel d'Ambanidia pour éviter les embouteillages"
    },
    { 
      id: "8399", 
      chauffeur: "Martijn Dragonjer", 
      ligne: "163", 
      statut: "on-time", 
      Cooperative: "Mirindra", 
      route: ROUTE_163,
      currentIdx: 0,
      position: ROUTE_163[0], 
      colors: { primary: '#3b82f6', secondary: '#eff6ff' },
      depart: "Ivato Aéroport", 
      etape: "Route de la Digue", 
      destination: "Analakely Esplanade",
      arrets: ["Ivato", "Talatamaty", "Ankazomanga", "Analakely"],
      horaires: { depart: "06:15", arrivee: "07:45" },
      historique: [[-18.7994, 47.4789]],
      suggestions: "Itinéraire le plus rapide via la route Digue"
    },
    { 
      id: "2739", 
      chauffeur: "Em Assinder", 
      ligne: "194", 
      statut: "on-time", 
      Cooperative: "MA-FA", 
      route: ROUTE_194,
      currentIdx: 0,
      position: ROUTE_194[0], 
      colors: { primary: '#16a34a', secondary: '#facc15' }, // Vert et Jaune de la ligne 194
      depart: "Itaosy Terminus", 
      etape: "Pont Ampasika", 
      destination: "Ankorondrano",
      arrets: ["Itaosy", "Ampasika", "Ampefiloha", "Analakely"],
      horaires: { depart: "05:30", arrivee: "07:00" },
      historique: [[-18.9154, 47.4641]],
      suggestions: "Axe fluide ce matin"
    },
    { 
      id: "8304", 
      chauffeur: "Sofietje Boksem", 
      ligne: "137", 
      statut: "on-time", 
      Cooperative: "Kofia", 
      route: ROUTE_137,
      currentIdx: 0,
      position: ROUTE_137[0], 
      colors: { primary: '#f97316', secondary: '#ffffff' },
      depart: "Vasacos Lalana", 
      etape: "Isotry Marché", 
      destination: "Tanjombato",
      arrets: ["Vasacos", "Isotry", "Anosy", "Tanjombato"],
      horaires: { depart: "06:40", arrivee: "08:10" },
      historique: [[-18.9015, 47.5112]],
      suggestions: "Planifier un départ anticipé à cause du marché"
    },
    { 
      id: "7649", 
      chauffeur: "Sofietje Boksem", 
      ligne: "154", 
      statut: "on-time", 
      Cooperative: "Trans-7", 
      route: ROUTE_154,
      currentIdx: 0,
      position: ROUTE_154[0], 
      colors: { primary: '#a855f7', secondary: '#ffffff' },
      depart: "Mahamasina Stade", 
      etape: "Anosy Rond-point", 
      destination: "Ampandrianomby",
      arrets: ["Mahamasina", "Anosy", "Mausolée", "Ampandrianomby"],
      horaires: { depart: "07:00", arrivee: "08:20" },
      historique: [[-18.9185, 47.5224]],
      suggestions: "Ralentissement à prévoir autour du stade"
    },
  ]);

  const animationRef = useRef();
  const SEGMENT_DURATION = 4000; // 4 secondes de transition par segment de rue pour plus de réalisme

  // Système cinématique d'interpolation fluide pas-à-pas le long des rues d'Antananarivo (LERP)
  useEffect(() => {
    let startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / SEGMENT_DURATION, 1);

      setTaxiBeList(prevList =>
        prevList.map(bus => {
          const startNode = bus.route[bus.currentIdx];
          let nextIdx = bus.currentIdx + 1;
          if (nextIdx >= bus.route.length) nextIdx = 0;
          const endNode = bus.route[nextIdx];

          const lat = startNode[0] + (endNode[0] - startNode[0]) * progress;
          const lng = startNode[1] + (endNode[1] - startNode[1]) * progress;

          return {
            ...bus,
            position: [lat, lng]
          };
        })
      );

      if (elapsed >= SEGMENT_DURATION) {
        startTime = performance.now();
        setTaxiBeList(prevList =>
          prevList.map(bus => {
            let nextIdx = bus.currentIdx + 1;
            if (nextIdx >= bus.route.length) nextIdx = 0;
            return {
              ...bus,
              currentIdx: nextIdx,
              position: bus.route[nextIdx]
            };
          })
        );
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  const filteredTaxiBe = taxiBeList.filter(bus => {
    const matchesFilter = filter === 'all' || bus.statut === filter;
    
    const query = searchQuery.toLowerCase();
    const matchesSearch = bus.id.includes(query) || 
                          bus.chauffeur.toLowerCase().includes(query) ||
                          bus.ligne.includes(query) ||
                          bus.Cooperative.toLowerCase().includes(query) ||
                          bus.depart.toLowerCase().includes(query) ||
                          bus.destination.toLowerCase().includes(query) ||
                          bus.arrets.some(stop => stop.toLowerCase().includes(query));
                          
    return matchesFilter && matchesSearch;
  });

  const countDrivers = taxiBeList.length;
  const countTasks = taxiBeList.reduce((acc, curr) => acc + (curr.statut === 'on-time' ? 2 : 1), 0);

  return (
    <div className="flex-1 h-screen relative flex flex-col font-sans select-none overflow-hidden bg-[#f3f4f6]">
      
      {/* 1. BARRE DE NAVIGATION SUPÉRIEURE */}
      <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-[1000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pointer-events-none">
        
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-3 sm:p-4 shadow-xl border border-gray-100 flex flex-col items-center w-44 sm:w-52 pointer-events-auto relative"
        >
          <div className="absolute top-2 right-3 text-gray-400 cursor-pointer text-xs font-bold">i</div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-100 border-2 border-white shadow-md overflow-hidden flex items-center justify-center font-bold text-orange-700 text-xs sm:text-sm mb-1.5 sm:border-b-2">
            MD
          </div>
          <h4 className="text-[11px] sm:text-xs font-bold text-gray-800 text-center truncate w-full leading-none">Martijn Dragonjer</h4>
          <div className="flex items-center gap-0.5 text-amber-500 font-bold text-[9px] sm:text-[10px] mt-1">
            ★ <span className="text-gray-600">4.9</span>
          </div>
          
          <div className="flex items-center gap-2 mt-2.5 w-full">
            <button className="flex-1 py-1.5 sm:py-2 bg-[#22c55e] hover:bg-green-600 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm">
              <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white" />
            </button>
            <button className="flex-1 py-1.5 sm:py-2 bg-[#22c55e] hover:bg-green-600 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm">
              <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white" />
            </button>
          </div>
        </motion.div>

        <div className="bg-white rounded-xl px-2.5 py-1.5 shadow-md border border-gray-100 flex items-center gap-2 pointer-events-auto self-end sm:self-auto">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-200 flex items-center justify-center font-bold text-[9px] sm:text-[10px] text-gray-700">AL</div>
          <span className="text-[10px] sm:text-[11px] font-bold text-gray-600">Angela Longoria</span>
          <span className="text-[8px] sm:text-[9px] text-gray-400">▼</span>
        </div>
      </div>

      {/* 2. LE COMPOSANT DE LA CARTE INTERACTIVE */}
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

          {/* Affichage des itinéraires réels complets sous forme de lignes fluides */}
          {filteredTaxiBe.map((bus) => (
            <Polyline 
              key={`route-${bus.id}`} 
              positions={bus.route} 
              pathOptions={{ 
                color: bus.colors.primary, 
                weight: 4, 
                opacity: 0.35,
                dashArray: '4, 8'
              }} 
            />
          ))}

          {/* Marqueurs cinématiques glissant le long du tracé réel urbain */}
          {filteredTaxiBe.map((bus) => (
            <Marker 
              key={bus.id} 
              position={bus.position}
              icon={createBusIcon(bus.ligne, bus.colors.primary, bus.colors.secondary)}
            >
              <Popup>
                <div className="text-xs font-sans p-1">
                  <p className="font-bold text-gray-800">Ligne {bus.ligne} ({bus.Cooperative})</p>
                  <p className="text-gray-500 font-medium mt-0.5">Chauffeur: {bus.chauffeur}</p>
                  <p className="text-gray-400 text-[10px]">Départ: {bus.horaires.depart} • Arrêts: {bus.arrets.join(', ')}</p>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-block mt-1 ${bus.statut === 'delayed' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {bus.statut === 'delayed' ? 'En retard' : 'À l\'heure'}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}

          <ZoomControl position="topright" />
        </MapContainer>
      </div>

      {/* 3. LE PANNEAU INFÉRIEUR COULISSANT */}
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white rounded-3xl p-3 sm:p-4 shadow-2xl border border-gray-100/80 z-[1000] flex flex-col gap-3 max-h-[40vh] sm:max-h-[320px]">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 border-b border-gray-50 pb-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl p-0.5 bg-gray-100 font-bold text-[10px] sm:text-[11px]">
              <button className="px-2.5 py-1.5 bg-[#5b51ef] text-white rounded-lg shadow-sm whitespace-nowrap">Chauffeurs <span className="opacity-60 font-medium ml-1">{countDrivers}</span></button>
              <button className="px-2.5 py-1.5 text-gray-500 hover:text-gray-800 whitespace-nowrap">Courses <span className="opacity-60 font-medium ml-1">{countTasks}</span></button>
            </div>

            <div className="hidden sm:block w-px h-5 bg-gray-200 mx-1" />

            <div className="flex rounded-xl p-0.5 bg-gray-100 font-bold text-[10px] sm:text-[11px]">
              <button onClick={() => setFilter('all')} className={`px-2.5 py-1.5 rounded-lg transition-all ${filter === 'all' ? 'bg-white text-[#5b51ef] shadow-sm' : 'text-gray-500'}`}>Tous</button>
              <button onClick={() => setFilter('on-time')} className={`px-2.5 py-1.5 rounded-lg transition-all ${filter === 'on-time' ? 'bg-white text-[#5b51ef] shadow-sm' : 'text-gray-500'}`}>À l'heure</button>
              <button onClick={() => setFilter('delayed')} className={`px-2.5 py-1.5 rounded-lg transition-all ${filter === 'delayed' ? 'bg-white text-[#5b51ef] shadow-sm' : 'text-gray-500'}`}>En retard</button>
            </div>
          </div>

          <div className="relative w-full lg:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher ligne, arrêt ou itinéraire..." 
              className="w-full pl-8 pr-4 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-[11px] focus:outline-none font-medium text-gray-700"
            />
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-1 flex-1">
          <AnimatePresence mode="popLayout">
            {filteredTaxiBe.map((bus) => (
              <motion.div 
                key={bus.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                className={`min-w-[240px] sm:min-w-[260px] max-w-[340px] bg-white border border-gray-100 p-3 rounded-2xl flex flex-col justify-between shadow-sm relative ${
                  bus.id === "8399" ? "min-w-[320px] sm:min-w-[360px] border-l-2 border-l-[#5b51ef]" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-gray-800">{bus.id} <span className="text-[10px] font-normal text-gray-400">({bus.Cooperative} - Ligne {bus.ligne})</span></span>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-0.5 ${
                      bus.statut === 'delayed' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {bus.statut === 'delayed' ? <AlertTriangle className="w-2.5 h-2.5" /> : null}
                      {bus.statut === 'delayed' ? bus.retard : 'À L\'HEURE'}
                    </span>
                  </div>

                  {bus.id === "8399" ? (
                    <div className="mt-2 flex flex-col gap-2 text-[10px] font-bold">
                      <div className="flex items-center justify-between text-gray-400 gap-2">
                        <div className="flex items-center gap-2 truncate"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0" /> <span className="truncate">{bus.depart}</span> <span className="font-medium text-[9px] truncate">{bus.etape}</span></div>
                        <div className="flex items-center gap-1.5 flex-shrink-0"><span>{bus.horaires.depart}</span><span className="text-emerald-500 bg-emerald-50 px-1 rounded text-[8px]">Terminé</span></div>
                      </div>
                      <div className="flex items-center justify-between text-gray-700 bg-purple-50/40 p-1.5 rounded-lg gap-2">
                        <div className="flex items-center gap-2 truncate"><span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" /> <span className="truncate">{bus.destination}</span> <span className="font-medium text-[9px] text-gray-500 truncate">1810 Pico</span></div>
                        <div className="flex items-center gap-1.5 flex-shrink-0"><span>{bus.horaires.arrivee}</span><span className="text-white bg-[#5b51ef] px-1 rounded text-[8px]">En cours</span></div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 flex flex-col gap-1 text-[11px] font-semibold text-gray-500">
                      <div className="flex items-center gap-1.5"><MapPin className="w-3 text-purple-500 flex-shrink-0" /> <span className="text-gray-700 font-bold truncate">{bus.depart}</span></div>
                      <div className="text-[10px] pl-4 text-gray-400 truncate">{bus.etape}</div>
                      <div className="flex items-center gap-1.5 mt-1"><MapPin className="w-3 text-red-400 flex-shrink-0" /> <span className="text-gray-400 truncate">{bus.destination}</span></div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-50 pt-2 mt-2.5 flex items-center justify-between text-[10px] font-bold text-gray-400">
                  <span className="text-gray-700 font-extrabold truncate pr-2">{bus.chauffeur}</span>
                  <span className="flex items-center gap-1 flex-shrink-0"><Clock className="w-3" /> 2H EN LIGNE</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}