const db = require('../config/db');

// Récupérer les arrêts
exports.getStops = (req, res) => {
  const sql = 'SELECT *, ST_AsText(location) AS geom FROM bus_stops';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Récupérer les trajets
exports.getRoutes = (req, res) => {
  const sql = 'SELECT *, ST_AsText(route_geom) AS geom FROM bus_routes';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Récupérer un trajet par id
exports.getRouteById = (req, res) => {
  const sql = 'SELECT *, ST_AsText(route_geom) AS geom FROM bus_routes WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ error: 'Ligne introuvable.' });
    res.json(results[0]);
  });
};

// Mettre à jour un trajet
exports.updateRoute = (req, res) => {
  const { id } = req.params;
  const body = req.body || {};
  const mapping = {
    code: 'ref',
    nom: 'name',
    geom: 'route_geom',
    route_geom: 'route_geom',
    depart: 'depart',
    arrivee: 'arrivee',
    coop: 'coop',
    statut: 'statut',
    tarif: 'tarif',
    distance: 'distance',
    duree: 'duree',
    vehicules: 'vehicules',
    date: 'date',
    activite: 'activite',
    description: 'description',
    commentaire: 'commentaire'
  };

  const updateData = {};
  Object.entries(body).forEach(([key, value]) => {
    const column = mapping[key] || key;
    if (['ref','name','route_geom','depart','arrivee','coop','statut','tarif','distance','duree','vehicules','date','activite','description','commentaire'].includes(column)) {
      updateData[column] = value;
    }
  });

  if (!Object.keys(updateData).length) {
    return res.status(400).json({ error: 'Aucune donnée valide fournie pour la mise à jour.' });
  }

  const sql = 'UPDATE bus_routes SET ? WHERE id = ?';
  db.query(sql, [updateData, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Ligne introuvable.' });
    res.json({ id, ...updateData });
  });
};

// Supprimer un trajet
exports.deleteRoute = (req, res) => {
  const sql = 'DELETE FROM bus_routes WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Ligne introuvable.' });
    res.json({ success: true, deletedId: req.params.id });
  });
};