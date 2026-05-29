const { importBusData } = require('./services/busDataService');

async function run() {
    console.log("Démarrage de l'importation...");
    try {
        await importBusData();
        console.log("Importation terminée avec succès !");
    } catch (error) {
        console.error("Erreur lors de l'importation :", error);
    }
    process.exit();
}

run();