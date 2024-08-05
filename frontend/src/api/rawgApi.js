import axios from 'axios';

const API_KEY = process.env.REACT_APP_RAWG_API;
const BASE_URL = 'https://api.rawg.io/api/games';

export const searchGames = async (query,limit = 10) => {
    const response = await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&search=${query}`);
    return response.data.results.slice(0,limit).map(game => ({
        id: game.id,
        name: game.name,
        poster_path: game.background_image,
        released: game.released,
    }));
};

export const getGameDetails = async (gameId) => {
    try {
        const response = await axios.get(`https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching game details:', error);
        return null;
    }
};

export const getTrendingGames = async () => {
    try {
        const response = await axios.get(`${BASE_URL}`, {
            params: {
                key: API_KEY,
                dates: '2020-01-01,2020-12-31', // Adjust the dates to current year for new releases
                ordering: '-released' // Newest first
            }
        });
        return response.data.results.map(game => ({
            id: game.id,
            name: game.name,
            image: game.background_image,
            released: game.released,
        }));
    } catch (error) {
        console.error('Error fetching trending games:', error);
        return [];
    }
};

export const getPopularGames = async () => {
    try {
        const response = await axios.get(`${BASE_URL}`, {
            params: {
                key: API_KEY,
                ordering: '-rating' // Highest rated first
            }
        });
        return response.data.results.map(game => ({
            id: game.id,
            name: game.name,
            image: game.background_image,
            released: game.released,
        }));
    } catch (error) {
        console.error('Error fetching popular games:', error);
        return [];
    }
};




