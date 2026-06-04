import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix des icônes Leaflet par défaut
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

// Styles pour les marqueurs personnalisés
const createDotIcon = (color) => L.divIcon({
  className: 'custom-dot',
  html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
  iconSize: [12, 12]
});

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => { if (center) map.setView(center, zoom); }, [center, map, zoom]);
  return null;
};

const SuiviGPS = () => {
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  const [depart, setDepart] = useState('');
  const [terminus, setTerminus] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [mapCenter, setMapCenter] = useState([-18.879, 47.507]);

  useEffect(() => {
    fetch('http://localhost:5000/api/bus/routes').then(res => res.json()).then(setRoutes);
    fetch('http://localhost:5000/api/bus/stops').then(res => res.json()).then(setStops);
  }, []);

  const parseWKT = (wkt) => {
    if (!wkt || typeof wkt !== 'string') return [];
    const match = wkt.match(/\(([^)]+)\)/);
    if (!match) return [];
    return match[1].split(',').map(pair => {
      const coords = pair.trim().split(/\s+/).map(Number);
      return [coords[1], coords[0]]; 
    }).filter(c => !isNaN(c[0]) && !isNaN(c[1]));
  };

  const filteredRoutes = routes.filter(r => 
    (r.name || "").toLowerCase().includes(depart.toLowerCase()) && 
    (r.name || "").toLowerCase().includes(terminus.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', fontFamily: 'Arial, sans-serif' }}>
      {/* Panneau Latéral Gauche */}
      <div style={{ width: '350px', background: '#fff', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column', zIndex: 1000 }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
          <h2 style={{ margin: '0 0 15px 0' }}>Directions</h2>
          <input type="text" placeholder="Départ..." value={depart} onChange={(e) => setDepart(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input type="text" placeholder="Terminus..." value={terminus} onChange={(e) => setTerminus(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredRoutes.map(r => (
            <div key={r.id} onClick={() => { setSelectedRoute(r); setMapCenter(parseWKT(r.geom)[0]); }} style={{ padding: '15px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}>
              <strong style={{ color: '#1a73e8' }}>Ligne {r.ref}</strong><br/>
              <small style={{ color: '#555' }}>{r.name}</small>
            </div>
          ))}
        </div>
      </div>

      {/* Zone Carte */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
          <ChangeView center={mapCenter} zoom={13} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {selectedRoute && (
            <React.Fragment>
              <Polyline positions={parseWKT(selectedRoute.geom)} color="#1a73e8" weight={6} />
              
              {/* Marqueur Départ (Bleu) */}
              <Marker position={parseWKT(selectedRoute.geom)[0]} icon={createDotIcon('blue')} />
              
              {/* Marqueur Terminus (Rouge) */}
              <Marker position={parseWKT(selectedRoute.geom).slice(-1)[0]} icon={createDotIcon('red')} />
              
              {/* Affichage des arrêts (Points verts) */}
              {stops.filter(s => {
                const sCoords = parseWKT(s.geom)[0];
                return sCoords && parseWKT(selectedRoute.geom).some(rPt => Math.abs(rPt[0]-sCoords[0]) < 0.005 && Math.abs(rPt[1]-sCoords[1]) < 0.005);
              }).map(s => (
                <Marker key={s.id} position={parseWKT(s.geom)[0]} icon={createDotIcon('green')} />
              ))}
            </React.Fragment>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default SuiviGPS;