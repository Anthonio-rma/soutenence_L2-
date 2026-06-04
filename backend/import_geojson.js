const fs = require('fs');
const mysql = require('mysql2/promise');

async function importGeoJSON() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost', 
      user: 'root', 
      password: '', 
      database: 'taxi_be_db'
    });

    const rawData = fs.readFileSync('./export.geojson', 'utf8');
    const { features } = JSON.parse(rawData);

    for (const feature of features) {
      if (!feature.geometry || !feature.properties) continue;

      // Débogage : Affichez les propriétés pour voir si 'name' ou 'ref' existent
      // console.log("Propriétés trouvées :", feature.properties);

      if (feature.geometry.type === 'Point') {
        // Priorité : nom, puis référence, puis "Arrêt sans nom"
        const name = feature.properties.name || feature.properties.ref || "Arrêt sans nom";
        const [lon, lat] = feature.geometry.coordinates;
        
        await connection.execute(
          'INSERT INTO bus_stops (name, location) VALUES (?, ST_PointFromText(?))',
          [name, `POINT(${lon} ${lat})`]
        );
      } 
      else if (feature.geometry.type === 'LineString') {
        const ref = feature.properties.ref || "N/A";
        const name = feature.properties.name || `Ligne ${ref}`; // Utilise le numéro si le nom est manquant
        
        const wkt = `LINESTRING(${feature.geometry.coordinates.map(c => `${c[0]} ${c[1]}`).join(', ')})`;
        
        await connection.execute(
          'INSERT INTO bus_routes (ref, name, route_geom) VALUES (?, ?, ST_GeomFromText(?))',
          [ref, name, wkt]
        );
      }
    }
    console.log("Importation terminée avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'importation :", error);
  } finally {
    if (connection) await connection.end();
  }
}

importGeoJSON();