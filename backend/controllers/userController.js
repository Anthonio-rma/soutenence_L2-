// backend/controllers/userController.js
const db = require('../config/db');
const { promisify } = require('util');

// Promisification pour utiliser await avec la fonction getUserById
const query = promisify(db.query).bind(db);

// 1. Récupérer UN utilisateur par son ID
// 1. Récupérer UN utilisateur par son ID
    exports.getUserById = async (req, res) => {
        try {
            const userId = req.params.id;
            
            // AJOUT DE "avatar_url" DANS LE SELECT
            const sql = `SELECT id, nom_complet, email, role, telephone, pays, ville, code_postal, identifiant_fiscal, avatar_url 
                        FROM users WHERE id = ?`;
            
            const results = await query(sql, [userId]);

            if (results.length === 0) {
                return res.status(404).json({ error: "Utilisateur non trouvé." });
            }

            res.status(200).json(results[0]);
        } catch (err) {
            console.error("Erreur lors de la récupération :", err);
            res.status(500).json({ error: "Erreur serveur interne." });
        }
    };
exports.uploadAvatar = (req, res) => {
    if (!req.file) return res.status(400).json({ error: "Pas de fichier" });

    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    const userId = req.params.id;

    // Utilisation de la variable 'db' importée
    const sql = "UPDATE users SET avatar_url = ? WHERE id = ?";
    
    db.query(sql, [imageUrl, userId], (err, result) => {
        if (err) {
            console.error("Erreur SQL :", err);
            return res.status(500).json({ error: "Erreur serveur BDD" });
        }
        res.json({ url: imageUrl });
    });
};

// 2. Mettre à jour l'utilisateur
exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { nom_complet, email, telephone, pays, ville, code_postal, identifiant_fiscal } = req.body;

        const sql = `UPDATE users SET 
                     nom_complet = ?, email = ?, telephone = ?, 
                     pays = ?, ville = ?, code_postal = ?, identifiant_fiscal = ? 
                     WHERE id = ?`;

        db.query(sql, [nom_complet, email, telephone, pays, ville, code_postal, identifiant_fiscal, userId], (err, result) => {
            if (err) {
                // Si l'email est déjà utilisé par un autre compte, on gère l'erreur ici
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: "Cet email est déjà utilisé par un autre compte." });
                }
                console.error("Erreur exécution SQL :", err);
                return res.status(500).json({ error: "Erreur lors de la mise à jour." });
            }

            res.json({ message: "Profil mis à jour avec succès !" });
        });
    } catch (err) {
        console.error("Erreur serveur :", err);
        res.status(500).json({ error: "Erreur serveur interne" });
    }
};