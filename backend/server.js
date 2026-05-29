require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Controllers & Routes
const userController = require('./controllers/userController');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const transitRoutes = require('./routes/transitRoutes');

// Initialisation
const app = express();
const server = http.createServer(app);
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Socket.io
const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || "http://localhost:3000", methods: ["GET", "POST", "PUT"] }
});
app.set('io', io);

// --- Middlewares ---
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));

if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// Debug Routeur : Affiche la méthode et l'URL de chaque requête
app.use((req, res, next) => {
    console.log(`[DEBUG] Requête reçue : ${req.method} ${req.url}`);
    next();
});

// --- Configuration Multer ---
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, 'uploads/'),
        filename: (req, file, cb) => {
            cb(null, `avatar-${req.params.id}-${Date.now()}${path.extname(file.originalname)}`);
        }
    })
});

// --- Routes & Statique ---
app.use('/uploads', express.static(uploadDir));
app.use('/api/auth', authRoutes);
app.use('/api/transit', transitRoutes); // Votre route /api/transit/calculer-itineraire dépend d'ici
app.use('/api', userRoutes);
app.post('/api/users/:id/avatar', upload.single('avatar'), userController.uploadAvatar);

// --- Gestion d'erreurs ---
app.use((req, res, next) => res.status(404).json({ error: "Endpoint non trouvé." }));

app.use((err, req, res, next) => {
    console.error(`[Error] ${err.message}`);
    res.status(err.status || 500).json({ 
        error: process.env.NODE_ENV === 'production' ? "Erreur interne" : err.message 
    });
});

// --- Démarrage ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Serveur opérationnel sur le port ${PORT}`);
    // Astuce debug : Liste les routes principales chargées
    console.log("Routes chargées : /api/auth, /api/transit, /api");
});