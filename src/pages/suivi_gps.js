import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Search, Phone, MessageSquare, AlertTriangle, Clock, MapPin, 
  Navigation, ArrowUpDown, Car, Footprints, Navigation2 
} from 'lucide-react';

import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

// --- TRACÉS URBAINS RÉELS ET PRÉCIS D'ANTANANARIVO ---
const ROUTE_119 = [
  [-18.9168, 47.5552], [-18.9195, 47.5485], [-18.9181, 47.5412], 
  [-18.9152, 47.5318], [-18.9105, 47.5255], [-18.9082, 47.5221], 
  [-18.9051, 47.5182], [-18.9088, 47.5115], [-18.9122, 47.5061]
];

const ROUTE_163 = [
  [-18.7994, 47.4789], [-18.8251, 47.4812], [-18.8415, 47.4764], 
  [-18.8650, 47.4892], [-18.8821, 47.5041], [-18.8912, 47.5145], 
  [-18.9011, 47.5192], [-18.9055, 47.5254]
];

const ROUTE_194 = [
  [-18.9154, 47.4641], [-18.9182, 47.4811], [-18.9145, 47.4952], 
  [-18.9112, 47.5114], [-18.9091, 47.5215], [-18.9055, 47.5254], 
  [-18.8812, 47.5311]
];

const ROUTE_137 = [
  [-18.9015, 47.5112], [-18.9054, 47.5141], [-18.9092, 47.5175], 
  [-18.9144, 47.5191], [-18.9252, 47.5214], [-18.9381, 47.5262], 
  [-18.9525, 47.5311]
];

const ROUTE_154 = [
  [-18.9185, 47.5224], [-18.9142, 47.5201], [-18.9151, 47.5312], 
  [-18.9168, 47.5415], [-18.9115, 47.5482], [-18.9052, 47.5514], 
  [-18.9012, 47.5565]
];

const TANA_CENTER = [-18.9100, 47.5250];

// Fonction utilitaire pour calculer la distance entre deux coordonnées géographiques (Formule de Haversine)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Calcule la distance totale d'un tracé complet
const calculateRouteLength = (route) => {
  let total = 0;
  for (let i = 0; i < route.length - 1; i++) {
    total += calculateDistance(route[i][0], route[i][1], route[i + 1][0], route[i + 1][1]);
  }
  return total.toFixed(2);
};

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

function ChangeMapView({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
}

export default function SuiviGps() {
  const [departInput, setDepartInput] = useState('');
  const [terminusInput, setTerminusInput] = useState('');
  const [activeRoute, setActiveRoute] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const [travelMode, setTravelMode] = useState('bus'); // 'bus' ou 'foot'
  const [nearbyBuses, setNearbyBuses] = useState([]);
  
  const [animatedBusPos, setAnimatedBusPos] = useState(null);
  const animationRef = useRef();
  const SEGMENT_DURATION = 2500;

  const [taxiBeList] = useState([
    { id: "2930", chauffeur: "Charles Davies", ligne: "119", statut: "delayed", retard: "12 MIN DE RETARD", Cooperative: "Taxis-be", route: ROUTE_119, colors: { primary: '#ef4444', secondary: '#ffffff' }, depart: "Ankatso", destination: "67Ha Centre", arrets: ["Ankatso", "Ambanidia", "Analakely", "67Ha"], trafic: "dense", pointEmbouteillage: "Analakely" },
    { id: "8399", chauffeur: "Martijn Dragonjer", ligne: "163", statut: "on-time", Cooperative: "Mirindra", route: ROUTE_163, colors: { primary: '#3b82f6', secondary: '#eff6ff' }, depart: "Ivato Aéroport", destination: "Analakely Esplanade", arrets: ["Ivato", "Talatamaty", "Ankazomanga", "Analakely"], trafic: "modéré", pointEmbouteillage: "Ankazomanga" },
    { id: "2739", chauffeur: "Em Assinder", ligne: "194", statut: "on-time", Cooperative: "MA-FA", route: ROUTE_194, colors: { primary: '#16a34a', secondary: '#facc15' }, depart: "Itaosy Terminus", destination: "Ankorondrano", arrets: ["Itaosy", "Ampasika", "Ampefiloha", "Analakely"], trafic: "dense", pointEmbouteillage: "Ankorondrano" },
    { id: "8304", chauffeur: "Sofietje Boksem", ligne: "137", statut: "on-time", Cooperative: "Kofia", route: ROUTE_137, colors: { primary: '#f97316', secondary: '#ffffff' }, depart: "Vasacos Lalana", destination: "Tanjombato", arrets: ["Vasacos", "Isotry", "Anosy", "Tanjombato"], trafic: "fluide", pointEmbouteillage: "Aucun" },
    { id: "7649", chauffeur: "Sofietje Boksem", ligne: "154", statut: "on-time", Cooperative: "Trans-7", route: ROUTE_154, colors: { primary: '#a855f7', secondary: '#ffffff' }, depart: "Mahamasina Stade", destination: "Ampandrianomby", arrets: ["Mahamasina", "Anosy", "Mausolée", "Ampandrianomby"], trafic: "modéré", pointEmbouteillage: "Anosy" }
  ]);

  // Déterminer les bus à proximité de la localisation actuelle (Centre de Tana par défaut, ou point de départ si rempli)
  useEffect(() => {
    let referenceLat = TANA_CENTER[0];
    let referenceLng = TANA_CENTER[1];

    if (departInput) {
      const matchingBus = taxiBeList.find(b => b.depart.toLowerCase().includes(departInput.toLowerCase()));
      if (matchingBus) {
        referenceLat = matchingBus.route[0][0];
        referenceLng = matchingBus.route[0][1];
      }
    }

    const filtered = taxiBeList.filter(bus => {
      return bus.route.some(coord => calculateDistance(referenceLat, referenceLng, coord[0], coord[1]) <= 1.5);
    });
    setNearbyBuses(filtered);
  }, [departInput, taxiBeList]);

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const handleSearchRoute = () => {
    if (!departInput || !terminusInput) return;

    if (travelMode === 'foot') {
      const startBus = taxiBeList.find(b => b.arrets.some(a => a.toLowerCase().includes(departInput.toLowerCase())));
      const endBus = taxiBeList.find(b => b.arrets.some(a => a.toLowerCase().includes(terminusInput.toLowerCase())));
      
      const startCoord = startBus ? startBus.route[0] : TANA_CENTER;
      const endCoord = endBus ? endBus.route[endBus.route.length - 1] : [-18.9120, 47.5300];

      const footRouteObj = {
        id: "foot-path",
        ligne: "À pied",
        chauffeur: "Vous",
        Cooperative: "Marche à pied",
        route: [startCoord, endCoord],
        colors: { primary: '#2563eb', secondary: '#ffffff' },
        depart: departInput,
        destination: terminusInput,
        arrets: [departInput, terminusInput],
        trafic: "fluide",
        pointEmbouteillage: "Aucun"
      };

      setActiveRoute(footRouteObj);
      setMapBounds(footRouteObj.route);
      setAnimatedBusPos(startCoord);
      return;
    }

    const foundBus = taxiBeList.find(bus => 
      bus.arrets.some(a => a.toLowerCase().includes(departInput.toLowerCase())) &&
      bus.arrets.some(a => a.toLowerCase().includes(terminusInput.toLowerCase()))
    );

    if (foundBus) {
      setActiveRoute(foundBus);
      setMapBounds(foundBus.route);
      
      if (animationRef.current) cancelAnimationFrame(animationRef.current);

      let currentIdx = 0;
      let startTime = performance.now();

      const animateMovement = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / SEGMENT_DURATION, 1);

        const startNode = foundBus.route[currentIdx];
        let nextIdx = currentIdx + 1;
        
        if (nextIdx >= foundBus.route.length) {
          currentIdx = 0;
          nextIdx = 1;
        }
        
        const endNode = foundBus.route[nextIdx];

        const lat = startNode[0] + (endNode[0] - startNode[0]) * progress;
        const lng = startNode[1] + (endNode[1] - startNode[1]) * progress;
        setAnimatedBusPos([lat, lng]);

        if (elapsed >= SEGMENT_DURATION) {
          startTime = performance.now();
          currentIdx = nextIdx;
        }

        animationRef.current = requestAnimationFrame(animateMovement);
      };

      animationRef.current = requestAnimationFrame(animateMovement);
    } else {
      alert("Aucune ligne directe trouvée entre ces deux arrêts.");
      setActiveRoute(null);
      setAnimatedBusPos(null);
    }
  };

  const handleInvertRoute = () => {
    const temp = departInput;
    setDepartInput(terminusInput);
    setTerminusInput(temp);
  };

  return (
    /* Changement important : max-w-full et w-full à la place de w-screen empêchent le bris de layout et le scroll horizontal */
    <div className="w-full max-w-full h-screen flex flex-row-reverse overflow-hidden font-sans bg-[#f4f4f4]">
      
      {/* ================= PANNEAU LATÉRAL DROITE ================= */}
      <div className="w-[380px] h-full bg-white shadow-2xl flex flex-col z-[1010] border-l border-gray-200 flex-shrink-0">
        
        {/* Section de saisie d'itinéraire */}
        <div className="p-4 bg-gray-50 border-b border-gray-200/60 pt-6">
          <div className="flex rounded-xl p-1 bg-gray-200/70 mb-4 max-w-max text-[11px] font-bold text-gray-600">
            <button 
              onClick={() => setTravelMode('bus')}
              className={`px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1 transition-all ${travelMode === 'bus' ? 'bg-white text-blue-600' : 'opacity-60'}`}
            >
              <Car className="w-3.5 h-3.5" /> En bus
            </button>
            <button 
              onClick={() => setTravelMode('foot')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${travelMode === 'foot' ? 'bg-white text-blue-600 shadow-sm' : 'opacity-60'}`}
            >
              <Footprints className="w-3.5 h-3.5" /> À pied
            </button>
          </div>

          <div className="relative flex items-center gap-3">
            <div className="absolute left-3 top-7 bottom-7 w-[2px] bg-gray-300 border-dashed" />
            
            <div className="flex flex-col gap-3 flex-1">
              {/* Champ Départ (A) */}
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm focus-within:border-blue-500 transition-colors">
                <span className="w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-100 flex-shrink-0" />
                <input 
                  type="text"
                  placeholder="Choisir le point de départ..."
                  value={departInput}
                  onChange={(e) => setDepartInput(e.target.value)}
                  className="w-full text-xs outline-none font-medium text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* Champ Terminus (B) */}
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm focus-within:border-blue-500 transition-colors">
                <span className="w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-100 flex-shrink-0" />
                <input 
                  type="text"
                  placeholder="Choisir le terminus..."
                  value={terminusInput}
                  onChange={(e) => setTerminusInput(e.target.value)}
                  className="w-full text-xs outline-none font-medium text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            <button 
              onClick={handleInvertRoute}
              className="p-2 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:shadow transition-all"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          <button 
            onClick={handleSearchRoute}
            className="w-full mt-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
          >
            <Navigation2 className="w-3.5 h-3.5 fill-white rotate-90" /> Trouver l'itinéraire
          </button>
        </div>

        {/* Zone des résultats de recherche / Infos Complémentaires */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeRoute ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-gradient-to-br from-white to-gray-50 border border-blue-100 p-4 rounded-2xl shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 bottom-0 w-1.5" style={{ backgroundColor: activeRoute.colors.primary }} />

                <div className="pl-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black px-2 py-1 rounded text-white shadow-sm" style={{ backgroundColor: activeRoute.colors.primary }}>
                      {travelMode === 'foot' ? 'Marche' : `Ligne ${activeRoute.ligne}`}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{activeRoute.Cooperative}</span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-800 mb-1">Détails du parcours</h3>
                  
                  <div className="text-[11px] text-gray-500 font-medium mb-3 space-y-1">
                    <p className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" /> 
                      {travelMode === 'foot' 
                        ? `~ ${(calculateRouteLength(activeRoute.route) * 12).toFixed(0)} min de marche` 
                        : `Fluide • ~ 18 min de trajet`}
                    </p>
                    <p className="flex items-center gap-1 text-blue-600 font-bold">
                      <MapPin className="w-3.5 h-3.5" /> Distance : {calculateRouteLength(activeRoute.route)} km
                    </p>
                  </div>

                  {/* Alerte Embouteillage Urbain */}
                  {travelMode === 'bus' && activeRoute.trafic === 'dense' && (
                    <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-amber-800">
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-[10px] font-medium">
                        <b>Trafic dense :</b> Embouteillage critique signalé au niveau de <span className="underline font-bold">{activeRoute.pointEmbouteillage}</span>.
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 border-l border-gray-200 pl-3 relative ml-1">
                    <div className="text-[11px] text-gray-600"><b className="text-gray-800">Départ :</b> {activeRoute.depart}</div>
                    {travelMode === 'bus' && <div className="text-[11px] text-gray-600"><b className="text-gray-800">Via :</b> {activeRoute.arrets.slice(1, -1).join(' → ')}</div>}
                    <div className="text-[11px] text-gray-600"><b className="text-gray-800">Terminus :</b> {activeRoute.destination}</div>
                  </div>

                  {/* Profils associés si transport en commun */}
                  {travelMode === 'bus' && (
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 font-bold text-xs text-indigo-700 flex items-center justify-center">
                          {activeRoute.chauffeffeur ? activeRoute.chauffeur.split(' ').map(n => n[0]).join('') : 'CH'}
                        </div>
                        <span className="text-xs font-bold text-gray-700">{activeRoute.chauffeur}</span>
                      </div>
                      <div className="flex gap-1.5">
                        <button className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"><Phone className="w-3 h-3" /></button>
                        <button className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"><MessageSquare className="w-3 h-3" /></button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center text-gray-400 p-6">
                <Navigation className="w-10 h-10 text-gray-300 stroke-[1.5] mb-2" />
                <p className="text-xs font-bold">Aucun itinéraire actif</p>
                <p className="text-[10px] text-gray-400 max-w-[200px] mt-1">Saisissez un parcours à Antananarivo pour démarrer la simulation.</p>
              </div>
            )}
          </AnimatePresence>

          {/* ================= SECTION : BUS À PROXIMITÉ DE MA LOCALISATION ================= */}
          <div className="pt-2 border-t border-gray-100">
            <h4 className="text-xs font-black text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-blue-500 fill-blue-500" /> À proximité (&lt; 1.5 km)
            </h4>
            <div className="space-y-2">
              {nearbyBuses.map(bus => (
                <div key={`nearby-${bus.id}`} className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200/70 rounded-xl text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-white font-black text-[10px]" style={{ backgroundColor: bus.colors.primary }}>
                      Ligne {bus.ligne}
                    </span>
                    <span className="font-medium text-gray-700">{bus.Cooperative}</span>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${bus.trafic === 'dense' ? 'bg-red-50 text-red-600' : bus.trafic === 'modéré' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                    {bus.trafic === 'dense' ? 'Embouteillage' : bus.trafic === 'modéré' ? 'Ralenti' : 'Fluide'}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ================= ZONE DE LA CARTE INTERACTIVE (GAUCHE) ================= */}
      <div className="flex-1 h-full relative z-0 min-w-0">
        <MapContainer 
          center={TANA_CENTER} 
          zoom={13} 
          zoomControl={false} 
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          <ChangeMapView bounds={mapBounds} />

          {/* Tracé général en arrière-plan */}
          {taxiBeList.map((bus) => (
            <Polyline 
              key={`bg-route-${bus.id}`} 
              positions={bus.route} 
              pathOptions={{ 
                color: bus.colors.primary, 
                weight: activeRoute?.id === bus.id ? 5 : 3, 
                opacity: activeRoute?.id === bus.id ? 0.8 : 0.2,
                dashArray: activeRoute?.id === bus.id ? '0' : '4, 8'
              }} 
            />
          ))}

          {/* Tracé spécifique pour le mode piéton */}
          {travelMode === 'foot' && activeRoute && (
            <Polyline 
              positions={activeRoute.route}
              pathOptions={{ color: '#2563eb', weight: 4, dashArray: '5, 10' }}
            />
          )}

          {/* Marqueur dynamique de progression */}
          {activeRoute && animatedBusPos && (
            <Marker 
              position={animatedBusPos}
              icon={travelMode === 'foot' 
                ? L.divIcon({ className: 'custom-foot', html: `<div class="p-2 bg-blue-600 rounded-full text-white shadow-lg border border-white"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M4 16v-2a2 2 0 1 1 4 0v2M16 14v2a2 2 0 1 0 4 0v-2"/></svg></div>`, iconSize: [20, 20] }) 
                : createBusIcon(activeRoute.ligne, activeRoute.colors.primary, activeRoute.colors.secondary)
              }
            >
              <Popup>
                <div className="text-xs p-1 font-sans">
                  <p className="font-bold text-gray-800">{travelMode === 'foot' ? 'Votre progression à pied' : `Ligne ${activeRoute.ligne} en mouvement`}</p>
                  <p className="text-gray-500 text-[10px]">Trafic zone : {activeRoute.trafic}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Repères Extrémités (A) & (B) */}
          {activeRoute && (
            <>
              <Marker position={activeRoute.route[0]}>
                <Popup><span className="text-xs font-bold text-blue-600">Départ (A) : {activeRoute.depart}</span></Popup>
              </Marker>
              <Marker position={activeRoute.route[activeRoute.route.length - 1]}>
                <Popup><span className="text-xs font-bold text-red-600">Terminus (B) : {activeRoute.destination}</span></Popup>
              </Marker>
            </>
          )}

          {/* Positionnement du ZoomControl en haut à gauche pour éviter la superposition avec le panneau droit */}
          <ZoomControl position="topleft" />
        </MapContainer>
      </div>

    </div>
  );
}