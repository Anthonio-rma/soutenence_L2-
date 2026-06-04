const db = require('../config/db');

// Récupérer les arrêts
exports.getStops = (req, res) => {
  const sql = 'SELECT id, name, ST_AsText(location) as geom FROM bus_stops';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Récupérer les trajets
exports.getRoutes = (req, res) => {
  const sql = 'SELECT id, ref, name, ST_AsText(route_geom) as geom FROM bus_routes';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};