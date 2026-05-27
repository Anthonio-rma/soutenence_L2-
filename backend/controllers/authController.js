const db = require('../config/db');
const bcrypt = require('bcrypt');
const { promisify } = require('util');
const { OAuth2Client } = require('google-auth-library');

const query = promisify(db.query).bind(db);
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 1. Inscription classique
exports.register = async (req, res) => {
    try {
        const { nom_complet, email, password, role } = req.body;
        if (!nom_complet || !email || !password) return res.status(400).json({ message: "Champs incomplets." });

        const existingUser = await query("SELECT id FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) return res.status(409).json({ message: "Cet email est déjà utilisé." });

        const hashedPassword = await bcrypt.hash(password, 10);
        await query("INSERT INTO users (nom_complet, email, password, role) VALUES (?, ?, ?, ?)",
            [nom_complet, email, hashedPassword, role || 'utilisateur']);

        res.status(201).json({ message: "Inscription réussie !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// 2. Connexion classique (SÉCURISÉE)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const results = await query("SELECT * FROM users WHERE email = ?", [email]);
        
        // CORRECTION : On vérifie si l'utilisateur existe ET s'il a un mot de passe avant de comparer
        const user = results[0];
        if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        res.status(200).json({ 
            message: "Connexion réussie", 
            user: { id: user.id, nom_complet: user.nom_complet, role: user.role } 
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// 3. Connexion Google (OAuth)
exports.googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email } = ticket.getPayload();

        let results = await query("SELECT * FROM users WHERE email = ?", [email]);
        let user;

        if (results.length > 0) {
            user = results[0];
        } else {
            // Insertion sans mot de passe (NULL)
            const insert = await query(
                "INSERT INTO users (nom_complet, email, role) VALUES (?, ?, ?)",
                [name, email, 'utilisateur']
            );
            user = { id: insert.insertId, nom_complet: name, role: 'utilisateur' };
        }

        res.status(200).json({ 
            message: "Connexion Google réussie", 
            user: { id: user.id, nom_complet: user.nom_complet, role: user.role } 
        });
    } catch (error) {
        res.status(401).json({ message: "Authentification Google échouée." });
    }
};