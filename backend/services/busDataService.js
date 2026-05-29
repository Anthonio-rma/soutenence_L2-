const fs = require('fs');
const path = require('path');
const db = require('../config/db');
// On crée une interface promise à partir de votre connexion existante
const dbPromise = db.promise(); 

const importBusData = async () => {
    try {
        const filePath = path.join(__dirname, '../data.geojson');
        
        if (!fs.existsSync(filePath)) {
            throw new Error("Fichier data.geojson introuvable.");
        }

        const rawData = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(rawData);

        console.log("Début de l'importation...");

        for (const feature of data.features || []) {
            const geom = feature.geometry;
            const props = feature.properties || {};

            // Filtrage strict : on ne traite que les tracés de bus
            if (geom && geom.type === 'LineString' && Array.isArray(geom.coordinates)) {
                
                // Insertion ligne
                const [result] = await dbPromise.execute(
                    'INSERT INTO lignes (numero_ligne) VALUES (?)', 
                    [String(props.ref || 'Inconnu')]
                );
                const ligneId = result.insertId;

                // Insertion des points avec batching ou boucle simple
                for (let i = 0; i < geom.coordinates.length; i++) {
                    const [lng, lat] = geom.coordinates[i];
                    
                    await dbPromise.execute(
                        'INSERT INTO trajets (ligne_id, lat, lng, ordre) VALUES (?, ?, ?, ?)',
                        [ligneId, lat, lng, i]
                    );
                }
                console.log(`Ligne ${props.ref || 'Inconnu'} importée.`);
            }
        }
        console.log("--- Importation terminée avec succès ! ---");
    } catch (err) {
        console.error("Erreur critique lors de l'importation :", err);
    }
};

module.exports = { importBusData };