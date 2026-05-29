const db = require('../config/db');
const pool = db.promise();

/**
 * 1. Récupération de tous les bus
 */
const getBuses = async (req, res) => {
    const sql = `
        SELECT b.*, l.numero_ligne, l.cooperative, l.color_primary, l.color_secondary,
               GROUP_CONCAT(CONCAT('[', t.lat, ',', t.lng, ']') ORDER BY t.ordre SEPARATOR ',') as trajet_coords
        FROM bus b
        INNER JOIN lignes l ON b.ligne_id = l.id
        LEFT JOIN trajets t ON b.ligne_id = t.ligne_id
        GROUP BY b.id
    `;

    try {
        const [rows] = await pool.query(sql);

        const formattedData = rows.map(row => {
            let routeData = [];
            try {
                routeData = row.trajet_coords ? JSON.parse(`[${row.trajet_coords}]`) : [];
            } catch (e) {
                console.error("Erreur parsing trajet_coords pour bus", row.id);
            }

            return {
                id: row.id.toString(),
                ligne: row.numero_ligne,
                chauffeur: row.chauffeur,
                Cooperative: row.cooperative,
                trafic: row.trafic || 'fluide',
                pointEmbouteillage: row.point_embouteillage || 'Aucun',
                route: routeData,
                colors: { 
                    primary: row.color_primary || '#2563eb', 
                    secondary: row.color_secondary || '#ffffff' 
                }
            };
        });

        res.status(200).json(formattedData);
    } catch (error) {
        console.error("Erreur getBuses:", error);
        res.status(500).json({ error: "Erreur serveur lors du chargement des bus." });
    }
};

/**
 * 2. Calcul d'itinéraire avec logs de débogage
 */
const calculerItineraire = async (req, res) => {
    const { depart, destination } = req.body;

    console.log(`[DEBUG] Tentative de calcul : '${depart}' vers '${destination}'`);

    if (!depart || !destination) {
        return res.status(400).json({ error: "Départ et destination requis." });
    }

    // Remplacez votre requête SQL actuelle par celle-ci :
        const sql = `
        SELECT b.depart, b.destination, l.numero_ligne, l.cooperative, l.color_primary, l.color_secondary,
               GROUP_CONCAT(CONCAT('[', t.lat, ',', t.lng, ']') ORDER BY t.ordre SEPARATOR ',') as trajet_coords
        FROM bus b
        JOIN lignes l ON b.ligne_id = l.id
        LEFT JOIN trajets t ON b.ligne_id = t.ligne_id -- Changé de JOIN à LEFT JOIN
        WHERE TRIM(LOWER(b.depart)) = TRIM(LOWER(?)) 
          AND TRIM(LOWER(b.destination)) = TRIM(LOWER(?))
        GROUP BY b.id
        LIMIT 1
    `;
    try {
        const [results] = await pool.query(sql, [depart, destination]);

        if (results.length === 0) {
            console.warn(`[WARNING] Aucun résultat trouvé en BDD pour : ${depart} -> ${destination}`);
            return res.status(404).json({ error: "Aucun itinéraire trouvé pour ce trajet." });
        }

        const row = results[0];
        const route = row.trajet_coords ? JSON.parse(`[${row.trajet_coords}]`) : [];

        res.status(200).json({
            ligne: row.numero_ligne,
            Cooperative: row.cooperative,
            route: route,
            colors: { primary: row.color_primary, secondary: row.color_secondary },
            depart: row.depart,
            destination: row.destination,
            arrets: [row.depart, row.destination] 
        });
    } catch (error) {
        console.error("Erreur fatale calculerItineraire:", error);
        res.status(500).json({ error: "Erreur interne du serveur lors du calcul." });
    }
};

module.exports = { getBuses, calculerItineraire };