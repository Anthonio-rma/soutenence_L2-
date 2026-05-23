// backend/controllers/authController.js
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

        if (!nom_complet || !email || !password) {
            return res.status(400).json({ message: "Champs incomplets." });
        }

        const existingUser = await query("SELECT id FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: "Cet email est déjà utilisé." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await query(
            "INSERT INTO users (nom_complet, email, password, role) VALUES (?, ?, ?, ?)",
            [nom_complet, email, hashedPassword, role || 'utilisateur']
        );

        res.status(201).json({ message: "Inscription réussie !" });
    } catch (error) {
        console.error("Erreur inscription :", error);
        res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
    }
};

// 2. Connexion classique
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const results = await query("SELECT * FROM users WHERE email = ?", [email]);
        
        if (results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        res.status(200).json({ 
            message: "Connexion réussie", 
            user: { nom_complet: results[0].nom_complet, role: results[0].role } 
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur lors de la connexion." });
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
            const insert = await query(
                "INSERT INTO users (nom_complet, email, role, password) VALUES (?, ?, ?, ?)",
                [name, email, 'utilisateur', 'google-auth-linked']
            );
            user = { id: insert.insertId, nom_complet: name, role: 'utilisateur' };
        }

        res.status(200).json({ 
            message: "Connexion Google réussie", 
            user: { nom_complet: user.nom_complet, role: user.role } 
        });
    } catch (error) {
        console.error("Erreur Google Auth :", error);
        res.status(401).json({ message: "Authentification Google échouée." });
    }
};