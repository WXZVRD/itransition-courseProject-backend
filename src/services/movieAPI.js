const axios = require('axios');

class MovieAPI {
    constructor() {
        this.apiKey = process.env.TMDB_API_KEY;
        this.apiUrl = process.env.MOVIE_API;
    }

    async searchMovies(query) {
        try {
            const response = await axios.get(this.apiUrl, {
                params: {
                    api_key: this.apiKey,
                    query: query,
                },
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${this.apiKey}`,
                }
            });

            return response.data.results.slice(0, 10);
        } catch (err) {
            console.error("Error searching for movies:", err);
            throw err;
        }
    }
}

module.exports = new MovieAPI();
