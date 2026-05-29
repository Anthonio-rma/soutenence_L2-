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
  [-18.9168, 47.482], [-18.9052, 47.5514], [-18.9012, 47.5565]
];

const TANA_CENTER = [-18.9100, 47.5250];

// Fonction utilitaire pour calculer la distance (Formule de Haversine)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; 
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
  const [travelMode, setTravelMode] = useState('bus'); 
  const [nearbyBuses, setNearbyBuses] = useState([]);
  
  const [animatedBusPos, setAnimatedBusPos] = useState(null);
  const animationRef = useRef();
  const SEGMENT_DURATION = 2500;

  const [taxiBeList, setTaxiBeList] = useState([]);
  const [loading, setLoading] = useState(true);
  

  

  useEffect(() => {
    // Cette fonction est auto-suffisante
    const fetchBuses = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/transit');
        if (!response.ok) throw new Error("Erreur réseau");
        const data = await response.json();
        setTaxiBeList(data);
      } catch (err) {
        console.error("Erreur chargement :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, []); // Pas de dépendances, pas de risques
  

  useEffect(() => {
    setActiveRoute(null);
    setAnimatedBusPos(null);
    console.log("Système réinitialisé : aucun itinéraire actif au démarrage.");
  }, []);

  useEffect(() => {
    let referenceLat = TANA_CENTER[0];
    let referenceLng = TANA_CENTER[1];

    if (departInput) {
      const matchingBus = taxiBeList.find(b => 
        b.depart && b.depart.toLowerCase().includes(departInput.toLowerCase())
      );
      
      // PROTECTION : On vérifie que 'matchingBus' et 'matchingBus.route' existent
      // et que 'matchingBus.route' contient au moins un élément
      if (matchingBus && Array.isArray(matchingBus.route) && matchingBus.route.length > 0) {
        referenceLat = matchingBus.route[0][0];
        referenceLng = matchingBus.route[0][1];
      }
    }

    const filtered = taxiBeList.filter(bus => {
      // PROTECTION : On vérifie que le bus a bien une route avant de faire le some()
      return bus.route && Array.isArray(bus.route) && bus.route.some(coord => 
        calculateDistance(referenceLat, referenceLng, coord[0], coord[1]) <= 1.5
      );
    });
    setNearbyBuses(filtered);
  }, [departInput, taxiBeList]);
  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const handleSearchRoute = async () => {
    // 1. Validation immédiate
    const departVal = departInput?.trim();
    const terminusVal = terminusInput?.trim();

    if (!departVal || !terminusVal) {
      alert("Veuillez remplir les champs de départ et de destination.");
      return;
    }

    // 2. Nettoyage TOTAL avant toute nouvelle recherche
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setActiveRoute(null);
    setAnimatedBusPos(null);
    setMapBounds(null);

    try {
      let result = null;

      // 3. Logique de transport
      if (travelMode === 'foot') {
        result = {
          id: "foot-path",
          ligne: "À pied",
          chauffeur: "Vous",
          Cooperative: "Marche à pied",
          route: [TANA_CENTER, [-18.9120, 47.5300]],
          colors: { primary: '#2563eb', secondary: '#ffffff' },
          depart: departVal,
          destination: terminusVal,
          arrets: [departVal, terminusVal],
          trafic: "fluide",
          pointEmbouteillage: "Aucun"
        };
      } else {
        const response = await fetch('http://localhost:5000/api/transit/calculer-itineraire', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ depart: departVal, destination: terminusVal })
        });

        if (!response.ok) throw new Error("Aucun itinéraire trouvé.");
        result = await response.json();
      }

      // 4. Lancement de l'animation si le résultat est valide
      if (result?.route?.length > 0) {
        setActiveRoute(result);
        setMapBounds(result.route);
        setAnimatedBusPos(result.route[0]);

        let currentIdx = 0;
        let startTime = performance.now();

        const animateMovement = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / SEGMENT_DURATION, 1);
          
          const startNode = result.route[currentIdx];
          const nextIdx = (currentIdx + 1) % result.route.length;
          const endNode = result.route[nextIdx];

          if (startNode && endNode) {
            const lat = startNode[0] + (endNode[0] - startNode[0]) * progress;
            const lng = startNode[1] + (endNode[1] - startNode[1]) * progress;
            setAnimatedBusPos([lat, lng]);
          }

          if (elapsed >= SEGMENT_DURATION) {
            // Si on arrive au bout, on boucle ou on arrête selon votre besoin
            if (nextIdx === 0) { 
                animationRef.current = null;
                return; 
            }
            startTime = performance.now();
            currentIdx = nextIdx;
          }
          animationRef.current = requestAnimationFrame(animateMovement);
        };
        
        animationRef.current = requestAnimationFrame(animateMovement);
      } else {
        throw new Error("Données de route invalides.");
      }
    } catch (error) {
      console.error("Erreur de recherche :", error);
      alert("Impossible de calculer l'itinéraire.");
      // Nettoyage en cas d'erreur
      setActiveRoute(null);
      setAnimatedBusPos(null);
      setMapBounds(null);
    }
  };

  const handleInvertRoute = () => {
    const temp = departInput;
    setDepartInput(terminusInput);
    setTerminusInput(temp);
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] flex flex-col-reverse md:flex-row-reverse overflow-hidden font-sans bg-[#f4f4f4] relative antialiased selection:bg-blue-500/30 isolation-auto">
      
      {/* ================= PANNEAU LATÉRAL (RECHERCHE D'ITINÉRAIRE) ================= */}
      <div className="w-full md:w-[380px] h-[45vh] md:h-full bg-white shadow-2xl flex flex-col z-[40] md:z-[1010] border-t md:border-t-0 md:border-l border-gray-200 flex-shrink-0 relative overflow-hidden">
        
        {/* Section fixe de saisie d'itinéraire */}
        <div className="p-4 bg-gray-50 border-b border-gray-200/60 pt-4 md:pt-6 flex-shrink-0">
          <div className="flex rounded-xl p-1 bg-gray-200/70 mb-3 md:mb-4 max-w-max text-[11px] font-bold text-gray-600">
            <button 
              onClick={() => setTravelMode('bus')}
              className={`px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1 transition-all duration-200 ${travelMode === 'bus' ? 'bg-white text-blue-600' : 'opacity-60 hover:opacity-100'}`}
            >
              <Car className="w-3.5 h-3.5" /> En bus
            </button>
            <button 
              onClick={() => setTravelMode('foot')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all duration-200 ${travelMode === 'foot' ? 'bg-white text-blue-600 shadow-sm' : 'opacity-60 hover:opacity-100'}`}
            >
              <Footprints className="w-3.5 h-3.5" /> À pied
            </button>
          </div>

          <div className="relative flex items-center gap-3">
            <div className="absolute left-3 top-7 bottom-7 w-[2px] bg-gray-300 border-dashed hidden md:block pointer-events-none" />
            
            <div className="flex flex-col gap-2 md:gap-3 flex-1">
              {/* Champ Départ (A) */}
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1.5 md:py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all duration-200">
                <span className="w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-100 flex-shrink-0" />
                <input 
                  type="text"
                  placeholder="Choisir le point de départ..."
                  value={departInput}
                  onChange={(e) => setDepartInput(e.target.value)}
                  className="w-full text-xs outline-none font-medium text-gray-700 placeholder-gray-400 bg-transparent"
                />
              </div>

              {/* Champ Terminus (B) */}
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1.5 md:py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all duration-200">
                <span className="w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-100 flex-shrink-0" />
                <input 
                  type="text"
                  placeholder="Choisir le terminus..."
                  value={terminusInput}
                  onChange={(e) => setTerminusInput(e.target.value)}
                  className="w-full text-xs outline-none font-medium text-gray-700 placeholder-gray-400 bg-transparent"
                />
              </div>
            </div>

            <button 
              onClick={handleInvertRoute}
              className="p-2 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:shadow-md active:scale-95 transition-all duration-200"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          <button 
            onClick={handleSearchRoute}
            className="w-full mt-3 md:mt-4 py-2 md:py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-200/50 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Navigation2 className="w-3.5 h-3.5 fill-white rotate-90" /> Trouver l'itinéraire
          </button>
        </div>

        {/* Zone défilante des résultats de recherche / Infos Complémentaires */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar touch-auto">
          <AnimatePresence mode="wait">
            {activeRoute ? (
              <motion.div
                key={activeRoute.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-gradient-to-br from-white to-gray-50 border border-blue-100 p-4 rounded-2xl shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 bottom-0 w-1.5" style={{ backgroundColor: activeRoute.colors.primary }} />

                <div className="pl-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black px-2 py-1 rounded text-white shadow-sm transition-colors duration-200" style={{ backgroundColor: activeRoute.colors.primary }}>
                      {travelMode === 'foot' ? 'Marche' : `Ligne ${activeRoute.ligne}`}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{activeRoute.Cooperative}</span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-800 mb-1">Détails du parcours</h3>
                  
                  <div className="text-[11px] text-gray-500 font-medium mb-3 space-y-1">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" /> 
                      {travelMode === 'foot' 
                        ? `~ ${(calculateRouteLength(activeRoute.route) * 12).toFixed(0)} min de marche` 
                        : `Fluide • ~ 18 min de trajet`}
                    </div>
                    <div className="flex items-center gap-1 text-blue-600 font-bold">
                      <MapPin className="w-3.5 h-3.5" /> Distance : {calculateRouteLength(activeRoute.route)} km
                    </div>
                  </div>

                  {/* Alerte Embouteillage Urbain */}
                  {travelMode === 'bus' && 
                    activeRoute && 
                    Array.isArray(activeRoute.arrets) && 
                    activeRoute.arrets.length > 0 ? (
                      <div className="text-[11px] text-gray-600">
                        <b className="text-gray-800">Via :</b> {activeRoute.arrets.join(' → ')}
                      </div>
                    ) : null
                  }

                  <div className="space-y-2 border-l border-gray-200 pl-3 relative ml-1">
                    <div className="text-[11px] text-gray-600"><b className="text-gray-800">Départ :</b> {activeRoute.depart}</div>
                    {travelMode === 'bus' && <div className="text-[11px] text-gray-600"><b className="text-gray-800">Via :</b> {activeRoute.arrets.slice(1, -1).join(' → ')}</div>}
                    <div className="text-[11px] text-gray-600"><b className="text-gray-800">Terminus :</b> {activeRoute.destination}</div>
                  </div>

                  {/* Profils associés si transport en commun */}
                  {travelMode === 'bus' && (
                    <div className="text-[11px] text-gray-600">
                      <b className="text-gray-800">Via :</b> {activeRoute.arrets?.slice(1, -1).join(' → ') || "Aucun arrêt intermédiaire"}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-32 md:h-48 flex flex-col items-center justify-center text-center text-gray-400 p-4 md:p-6">
                <Navigation className="w-8 h-8 md:w-10 md:h-10 text-gray-300 stroke-[1.5] mb-2" />
                <p className="text-xs font-bold">Aucun itinéraire actif</p>
                <p className="text-[10px] text-gray-400 max-w-[200px] mt-1">Saisissez un parcours à Antananarivo pour démarrer la simulation.</p>
              </div>
            )}
          </AnimatePresence>

          {/* ================= SECTION : BUS À PROXIMITÉ ================= */}
          <div className="pt-2 border-t border-gray-100">
            <h4 className="text-xs font-black text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-blue-500 fill-blue-500" /> À proximité (&lt; 1.5 km)
            </h4>
            <div className="space-y-2">
              {nearbyBuses.map(bus => (
                <div key={`nearby-${bus.id}`} className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200/70 rounded-xl text-[11px] hover:border-gray-300 transition-colors duration-150">
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

      {/* ================= ZONE DE LA CARTE INTERACTIVE ================= */}
      <div className="flex-1 h-[55vh] md:h-full relative z-[10] min-w-0 isolation-auto">
        <MapContainer 
          key={activeRoute ? activeRoute.id : 'empty'}
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
                <Popup><div className="text-xs font-bold text-blue-600">Départ (A) : {activeRoute.depart}</div></Popup>
              </Marker>
              <Marker position={activeRoute.route[activeRoute.route.length - 1]}>
                <Popup><div className="text-xs font-bold text-red-600">Terminus (B) : {activeRoute.destination}</div></Popup>
              </Marker>
            </>
          )}

          <ZoomControl position="topleft" />
        </MapContainer>
      </div>

    </div>
  );
}