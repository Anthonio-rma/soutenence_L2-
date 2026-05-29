const express = require('express');
const router = express.Router();
const transitController = require('../controllers/transitController');

// 1. Route GET (Celle qui fonctionne)
router.get('/', transitController.getBuses);

// 2. Route POST (Celle qui pose problème)
router.post('/calculer-itineraire', (req, res) => {
    console.log("Route POST /calculer-itineraire atteinte !");
    transitController.calculerItineraire(req, res);
});

// DEBUG : Afficher les routes enregistrées dans ce routeur
console.log("Routes enregistrées dans transitRoutes.js :");
router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(` - ${Object.keys(r.route.methods).join(',').toUpperCase()} : ${r.route.path}`);
    }
});

module.exports = router;