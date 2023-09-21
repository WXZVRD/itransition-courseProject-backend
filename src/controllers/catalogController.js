const gameAPI = require('../services/gameAPI');
const movieAPI = require('../services/movieAPI');
const booksAPI = require('../services/booksAPI');

class catalogController {

    constructor() {
    }

    async getGames (req, res) {
        try {
            const { query } = req.query;
            if (!query) {
                return res.status(400).json({ error: "Missing game parameter" });
            }

            const gamesArr = await gameAPI.searchGames(query);
            if (!gamesArr || gamesArr.length === 0) {
                return res.status(404).json({ error: "No games found" });
            }

            const newArr = gamesArr.map(gameData => ({
                id: gameData.id,
                title: gameData.name,
                cover: gameData.background_image,
            }));

            res.json(newArr);
        } catch (error) {
            console.error("Error fetching games:", error);
            res.status(500).json({ error: "An error occurred while fetching games" });
        }
    }

    async getMovies (req, res) {
        try {
            const { query } = req.query;
            if (!query) {
                return res.status(400).json({ error: "Missing movie parameter" });
            }

            const movieArr = await movieAPI.searchMovies(query);

            if (!movieArr || movieArr.length === 0) {
                return res.status(404).json({ error: "No movie found" });
            }

            const newArr = movieArr.map(movieData => ({
                id: movieData.id,
                title: movieData.title,
                cover: `https://image.tmdb.org/t/p/w500${movieData.poster_path}`,
            }));

            res.json(newArr);
        } catch (error) {
            console.error("Error fetching movie:", error);
            res.status(500).json({ error: "An error occurred while fetching movie" });
        }
    }

    async getBooks (req, res) {
        try {
            const { query } = req.query;
            if (!query) {
                return res.status(400).json({ error: "Missing book parameter" });
            }

            const booksArr = await booksAPI.searchBooks(query);
            if (!booksArr || booksArr.length === 0) {
                return res.status(404).json({ error: "No book found" });
            }

            const newArr = booksArr.map(bookData => ({
                id: bookData.id,
                title: bookData.volumeInfo.title,
                author: bookData.volumeInfo.authors[0],
                cover: bookData.volumeInfo.imageLinks ? bookData.volumeInfo.imageLinks.thumbnail : null
            }));
            res.json(newArr);
        } catch (error) {
            console.error("Error fetching books:", error);
            res.status(500).json({ error: "An error occurred while fetching books" });
        }
    }

}

module.exports = new catalogController
