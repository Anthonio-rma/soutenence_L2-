// backend/models/Bus.js
const db = require('../config/db');

const getAllBuses = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
          b.id, b.chauffeur, b.statut, b.trafic, b.depart, b.destination,
          l.numero_ligne as ligne, l.cooperative, 
          l.color_primary, l.color_secondary
      FROM bus b
      JOIN lignes l ON b.ligne_id = l.id
    `;
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = { getAllBuses };