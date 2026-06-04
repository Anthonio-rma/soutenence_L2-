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

function normalizeRole(role) {
    const raw = String(role || "").trim().toLowerCase();
    if (raw === "admin" || raw === "administrateur") return "administrateur";
    if (raw === "operateur" || raw === "opérateur") return "opérateur";
    return "utilisateur";
}

exports.getUsers = async (req, res) => {
    try {
        const sql = `SELECT id, nom_complet, email, role FROM users`;
        const results = await query(sql);

        const mapped = results.map(user => {
            const fullName = user.nom_complet || "";
            const [prenom, ...rest] = fullName.split(" ");
            return {
                id: user.id,
                prenom: prenom || "",
                nom: rest.join(" ") || "",
                email: user.email,
                role: normalizeRole(user.role),
                coop: "Indéfini",
                statut: "actif",
                date: "N/A",
                activite: "N/A",
            };
        });

        res.status(200).json(mapped);
    } catch (err) {
        console.error("Erreur lors de la récupération de la liste des utilisateurs :", err);
        res.status(500).json({ error: "Erreur serveur interne." });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const sql = "DELETE FROM users WHERE id = ?";
        db.query(sql, [userId], (err, result) => {
            if (err) {
                console.error("Erreur suppression utilisateur :", err);
                return res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur." });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Utilisateur non trouvé." });
            }
            res.json({ message: "Utilisateur supprimé avec succès." });
        });
    } catch (err) {
        console.error("Erreur serveur :", err);
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
        const { nom_complet, email, role } = req.body;

        const sql = `UPDATE users SET 
                     nom_complet = ?, email = ?, role = ? 
                     WHERE id = ?`;

        db.query(sql, [nom_complet, email, normalizeRole(role), userId], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: "Cet email est déjà utilisé par un autre compte." });
                }
                console.error("Erreur exécution SQL :", err);
                return res.status(500).json({ error: "Erreur lors de la mise à jour." });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Utilisateur non trouvé." });
            }

            res.json({ message: "Profil mis à jour avec succès !" });
        });
    } catch (err) {
        console.error("Erreur serveur :", err);
        res.status(500).json({ error: "Erreur serveur interne" });
    }
};