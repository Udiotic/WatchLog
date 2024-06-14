import axios from 'axios';

const API_KEY = 'a26cfd760b8de60d041bdc062f4ff9a7';
const BASE_URL = 'https://api.themoviedb.org/3';

export const searchMovies = async (query, limit = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query: query,
      },
    });
    return response.data.results.slice(0, limit).map(movie => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      release_date: movie.release_date,
  }));
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};
export const searchTVShows = async (query, limit = 10) => {
  const response = await axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${query}`);
  return response.data.results.slice(0,limit).map(tvshow => ({
    id: tvshow.id,
    name: tvshow.name,
    poster_path: tvshow.poster_path ? `https://image.tmdb.org/t/p/w500${tvshow.poster_path}` : null,
    first_air_date: tvshow.first_air_date,
}));
};
export const getMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: API_KEY,
        append_to_response: 'credits'
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};
export const getTVShowDetails = async (tvShowId) => {
  try {
      const response = await axios.get(`${BASE_URL}/tv/${tvShowId}`, {
          params: {
              api_key: API_KEY,
              append_to_response: 'credits',
          },
      });
      return response.data;
  } catch (error) {
      console.error('Error fetching TV show details:', error);
      return null;
  }
};