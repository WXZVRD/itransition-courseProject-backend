const axios = require('axios');

class BooksAPI {
    constructor() {
        this.API_KEY = process.env.GOOGLE_API_KEY;
        this.API = process.env.BOOKS_API;
    }

    async searchBooks(query) {
        try {
            const response = await axios.get(`${this.API}?q=${query}&key=${this.API_KEY}`);
            return response.data.items;
        } catch (err) {
            console.error("Error searching for games:", err);
            throw err;
        }
    }
}

module.exports = new BooksAPI();
