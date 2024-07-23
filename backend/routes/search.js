const express = require('express');
const router = express.Router();
const { searchMovies, searchTVShows } = require('../../frontend/src/api/tmdbApi');
const { searchBooks } = require('../../frontend/src/api/googlebooksApi');
const { searchGames } = require('../../frontend/src/api/rawgApi');
const { searchMusic } = require('../../frontend/src/api/lastfmApi');

router.get('/:category/:query', async (req, res) => {
    const { category, query } = req.params;

    try {
        let results = [];
        switch (category) {
            case 'movies':
                results = await searchMovies(query);
                break;
            case 'tvshows':
                results = await searchTVShows(query);
                break;
            case 'books':
                results = await searchBooks(query);
                break;
            case 'games':
                results = await searchGames(query);
                break;
            case 'music':
                results = await searchMusic(query);
                break;
            default:
                return res.status(400).json({ error: 'Invalid category' });
        }
        res.json(results);
    } catch (error) {
        console.error('Error fetching search results:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
