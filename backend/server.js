require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan'); // Journalisation des requêtes
const rateLimit = require('express-rate-limit'); // Protection contre le brute-force
const authRoutes = require('./routes/authRoutes');

const app = express();

// 1. Middlewares de sécurité de base
app.use(helmet()); 
app.use(express.json({ limit: '10kb' })); // Limite la taille du body JSON

// 2. Configuration CORS
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
}));

// 3. Rate Limiter : Limite à 100 requêtes par 15 min par IP (protection anti-spam/brute force)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "Trop de requêtes, veuillez réessayer plus tard." }
});
app.use('/api/', limiter);

// 4. Logging : Affiche les requêtes dans la console (en dev uniquement)
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// 5. Routes
app.use('/api/auth', authRoutes);

// 6. Gestion 404
app.use((req, res, next) => {
    res.status(404).json({ error: "Endpoint non trouvé." });
});

// 7. Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
    console.error(`[Error] ${err.message}`);
    res.status(err.status || 500).json({ 
        error: process.env.NODE_ENV === 'production' ? "Erreur interne" : err.message 
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur opérationnel sur le port ${PORT} [Mode: ${process.env.NODE_ENV || 'development'}]`);
});