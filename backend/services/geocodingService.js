const axios = require('axios');

const getCoordinates = async (address) => {
    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: { q: `${address}, Antananarivo`, format: 'json', limit: 1 },
            headers: { 'User-Agent': 'Projet-Bus-Soutenance' }
        });
        if (response.data.length > 0) {
            return [parseFloat(response.data[0].lat), parseFloat(response.data[0].lon)];
        }
        return null;
    } catch (err) { return null; }
};

module.exports = { getCoordinates };