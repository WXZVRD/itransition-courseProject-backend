const axios = require('axios');

class GameAPI {
    constructor() {
        this.apiKey = process.env.GAME_API_KEY;
        this.apiUrl = process.env.GAME_API;
    }

    async searchGames(query) {
        try {
            const response = await axios.get(this.apiUrl, {
                params: {
                    key: this.apiKey,
                    search: query,
                    page_size: 10
                },
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${this.apiKey}`,
                }
            });
            return response.data.results;
        } catch (err) {
            console.error("Error searching for games:", err);
            throw err;
        }
    }
}

module.exports = new GameAPI();
