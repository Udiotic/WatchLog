import axios from 'axios';

const API_KEY = '000df7409a9e40eead9b418d091a5945';

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




