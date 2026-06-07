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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const [routesResp, stopsResp] = await Promise.all([
          fetch('http://localhost:5000/api/bus/routes', { signal: controller.signal }),
          fetch('http://localhost:5000/api/bus/stops', { signal: controller.signal }),
        ]);

        if (!routesResp.ok || !stopsResp.ok) {
          throw new Error('Impossible de récupérer les données');
        }

        const [routesData, stopsData] = await Promise.all([routesResp.json(), stopsResp.json()]);
        setRoutes(Array.isArray(routesData) ? routesData : []);
        setStops(Array.isArray(stopsData) ? stopsData : []);

        if (Array.isArray(routesData) && routesData.length) {
          const firstCoords = parseWKT(routesData[0].geom)[0];
          if (firstCoords) setMapCenter(firstCoords);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
          setError(err.message || 'Erreur réseau');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, []);

  const parseWKT = (wkt) => {
    if (!wkt || typeof wkt !== 'string') return [];
    const raw = wkt.trim();

    const lineMatch = raw.match(/LINESTRING\s*\((.*)\)/i);
    const multiMatch = raw.match(/MULTILINESTRING\s*\(\((.*)\)\)/i);
    const pointMatch = raw.match(/POINT\s*\((.*)\)/i);
    let coordsText = '';

    if (lineMatch) coordsText = lineMatch[1];
    else if (multiMatch) coordsText = multiMatch[1];
    else if (pointMatch) coordsText = pointMatch[1];
    else return [];

    return coordsText.split(',').map(pair => {
      const [x, y] = pair.trim().split(/\s+/).map(Number);
      return [y, x];
    }).filter(([lat, lng]) => !Number.isNaN(lat) && !Number.isNaN(lng));
  };

  const filteredRoutes = routes.filter(r => {
    if (!depart && !terminus) return true;
    const searchValue = `${r.ref || ''} ${r.name || ''}`.toLowerCase();
    return searchValue.includes(depart.toLowerCase()) && searchValue.includes(terminus.toLowerCase());
  });

  const selectedRouteCoords = selectedRoute ? parseWKT(selectedRoute.geom) : [];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily: 'Arial, sans-serif', background:'#f5f7fb' }}>
        <div style={{ textAlign:'center', color:'#334155' }}>
          <div style={{ fontSize:24, marginBottom:12 }}>Chargement des trajets...</div>
          <div style={{ color:'#64748b' }}>Veuillez patienter pendant que les données sont récupérées depuis la base.</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Arial, sans-serif', background:'#f8f9fa' }}>
        <div style={{ padding:24, borderRadius:16, background:'#fff', boxShadow:'0 12px 40px rgba(15,23,42,0.08)' }}>
          <h2 style={{ margin:0, color:'#111827' }}>Erreur</h2>
          <p style={{ margin:'12px 0 0', color:'#475569' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight:'100vh', width: '100vw', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ width: '360px', background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', zIndex: 1000 }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ margin: '0 0 14px 0', fontSize:22, color:'#0f172a' }}>Lignes de bus</h2>
          <p style={{ margin:0, color:'#475569', fontSize:14 }}>Toutes les données de la base sont affichées ici. Sélectionnez une ligne pour voir le tracé et les arrêts.</p>
          <div style={{ marginTop:18, display:'grid', gap:12 }}>
            <input
              type="text"
              placeholder="Recherche par code ou nom"
              value={depart}
              onChange={(e) => setDepart(e.target.value)}
              style={{ width:'100%', padding:'12px 14px', borderRadius:12, border:'1px solid #cbd5e1', background:'#f8fafc' }}
            />
            <input
              type="text"
              placeholder="Filtrer par terme additionnel"
              value={terminus}
              onChange={(e) => setTerminus(e.target.value)}
              style={{ width:'100%', padding:'12px 14px', borderRadius:12, border:'1px solid #cbd5e1', background:'#f8fafc' }}
            />
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'12px 0' }}>
          {filteredRoutes.length === 0 ? (
            <div style={{ padding:20, color:'#64748b' }}>Aucune ligne trouvée pour ce filtre.</div>
          ) : (
            filteredRoutes.map(route => {
              const coords = parseWKT(route.geom);
              return (
                <div
                  key={route.id}
                  onClick={() => {
                    setSelectedRoute(route);
                    if (coords.length) setMapCenter(coords[Math.floor(coords.length / 2)]);
                  }}
                  style={{
                    padding:'14px 18px',
                    cursor:'pointer',
                    borderBottom:'1px solid #eef2ff',
                    background: selectedRoute?.id === route.id ? '#eef2ff' : 'transparent'
                  }}
                >
                  <div style={{ display:'flex', justifyContent:'space-between', gap:14, alignItems:'center' }}>
                    <div>
                      <div style={{ fontSize:15, fontWeight:700, color:'#0f172a' }}>{route.ref ? `Ligne ${route.ref}` : `Trajet ${route.id}`}</div>
                      <div style={{ marginTop:4, fontSize:13, color:'#475569' }}>{route.name || 'Sans nom'}</div>
                    </div>
                    <div style={{ fontSize:12, color:'#64748b' }}>{coords.length ? `${coords.length} points` : 'Pas de géométrie'}</div>
                  </div>
                  <div style={{ marginTop:10, fontSize:12, color:'#64748b' }}>
                    {route.description ? route.description : route.commentaire ? route.commentaire : `ID base: ${route.id}`}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div style={{ padding:'18px 24px', borderTop:'1px solid #e2e8f0', background:'#f8fafc' }}>
          <div style={{ fontSize:13, color:'#334155', marginBottom:8 }}>Total des lignes</div>
          <div style={{ fontSize:24, fontWeight:700, color:'#0f172a' }}>{routes.length}</div>
          <div style={{ marginTop:10, fontSize:13, color:'#475569' }}>{stops.length} arrêts disponibles</div>
        </div>
      </div>

      <div style={{ flex:1, position:'relative' }}>
        <MapContainer center={mapCenter} zoom={12} style={{ height:'100%', width:'100%' }}>
          <ChangeView center={mapCenter} zoom={12} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {routes.map(route => {
            const positions = parseWKT(route.geom);
            if (!positions.length) return null;
            return (
              <Polyline
                key={`route-${route.id}`}
                positions={positions}
                color={selectedRoute?.id === route.id ? '#0f72f0' : '#94a3b8'}
                weight={selectedRoute?.id === route.id ? 6 : 3}
                opacity={selectedRoute?.id === route.id ? 0.95 : 0.45}
              />
            );
          })}

          {selectedRouteCoords.length > 0 && (
            <>
              <Marker position={selectedRouteCoords[0]} icon={createDotIcon('#2563eb')} />
              <Marker position={selectedRouteCoords[selectedRouteCoords.length-1]} icon={createDotIcon('#dc2626')} />
            </>
          )}

          {stops.map(stop => {
            const point = parseWKT(stop.geom)[0];
            if (!point) return null;
            return <Marker key={stop.id} position={point} icon={createDotIcon('#16a34a')} />;
          })}
        </MapContainer>

        {selectedRoute && (
          <div style={{ position:'absolute', bottom:20, left:20, right:20, background:'#ffffffee', border:'1px solid #dbeafe', borderRadius:18, padding:18, boxShadow:'0 20px 60px rgba(15,23,42,0.12)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
              <div>
                <div style={{ fontSize:16, fontWeight:700, color:'#0f172a' }}>{selectedRoute.ref ? `Ligne ${selectedRoute.ref}` : selectedRoute.name || 'Trajet sélectionné'}</div>
                <div style={{ marginTop:4, fontSize:13, color:'#475569' }}>{selectedRoute.name || 'Aucune description'}</div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:12 }}>
                {selectedRoute.distance && <div style={{ fontSize:13, color:'#334155' }}>Distance: <strong>{selectedRoute.distance} km</strong></div>}
                {selectedRoute.tarif && <div style={{ fontSize:13, color:'#334155' }}>Tarif: <strong>{selectedRoute.tarif} Ar</strong></div>}
                {selectedRoute.vehicules != null && <div style={{ fontSize:13, color:'#334155' }}>Véhicules: <strong>{selectedRoute.vehicules}</strong></div>}
              </div>
            </div>
            {selectedRoute.geom && (
              <div style={{ marginTop:14, fontSize:12, color:'#475569', overflowX:'auto' }}><strong>Géométrie WKT :</strong> {selectedRoute.geom}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuiviGPS;