const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const { promisify } = require('util');
const { OAuth2Client } = require('google-auth-library');

const query = promisify(db.query).bind(db);
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Aide à la sécurisation : filtrage strict des données utilisateur
const sanitizeUser = (user) => ({
    id: user.id,
    nom_complet: user.nom_complet,
    email: user.email,
    role: user.role
});

// Middleware de validation simple pour éviter la duplication de code
const validateFields = (fields) => (req, res, next) => {
    for (const field of fields) {
        if (!req.body[field]) return res.status(400).json({ error: `Champ ${field} requis.` });
    }
    next();
};

// Route d'inscription
router.post('/register', validateFields(['nom_complet', 'email', 'password']), async (req, res) => {
    try {
        const { nom_complet, email, password, role } = req.body;
        
        // Vérification de l'existence de l'utilisateur
        const users = await query("SELECT id FROM users WHERE email = ?", [email]);
        if (users.length > 0) {
            return res.status(409).json({ error: "Email déjà utilisé." });
        }

        const hashedPassword = await bcrypt.hash(password, 12); // Augmentation du coût à 12
        await query(
            "INSERT INTO users (nom_complet, email, password, role) VALUES (?, ?, ?, ?)",
            [nom_complet, email, hashedPassword, role || 'utilisateur']
        );

        res.status(201).json({ message: "Inscription réussie." });
    } catch (err) {
        console.error("Erreur inscription :", err);
        res.status(500).json({ error: "Erreur serveur interne." });
    }
});

// Route de connexion classique
router.post('/login', validateFields(['email', 'password']), async (req, res) => {
    try {
        const { email, password } = req.body;
        const [user] = await query("SELECT * FROM users WHERE email = ?", [email]);
        
        // Vérification sécurisée
        if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Identifiants invalides." });
        }

        res.status(200).json({ user: sanitizeUser(user) });
    } catch (err) {
        console.error("Erreur login :", err);
        res.status(500).json({ error: "Erreur serveur interne." });
    }
});

// Authentification Google optimisée
router.post('/google', async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Token manquant." });

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email } = ticket.getPayload();

        let [user] = await query("SELECT * FROM users WHERE email = ?", [email]);

        if (!user) {
            // Utilisation d'une transaction ou requête simple sécurisée
            const result = await query(
                "INSERT INTO users (nom_complet, email, role, password) VALUES (?, ?, ?, NULL)",
                [name, email, 'utilisateur']
            );
            user = { id: result.insertId, nom_complet: name, email, role: 'utilisateur' };
        }

        res.status(200).json({ user: sanitizeUser(user) });
    } catch (err) {
        console.error("Erreur Google Auth :", err);
        res.status(401).json({ error: "Authentification Google échouée." });
    }
});

module.exports = router;