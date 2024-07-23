import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './watchlist.css';
import { getMovieDetails } from '../../api/tmdbApi';
import MovieIconBar from '../../components/MovieIconBar';

const Watchlist = () => {
    const { username } = useParams();
    const [watchlistMovies, setWatchlistMovies] = useState([]);
    const [sortType, setSortType] = useState('release_date');
    const [ascending, setAscending] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWatchlistMovies = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/user/watchlist-movies/${username}`);
                const moviesWithDetails = await Promise.all(response.data.map(async (movie) => {
                    const details = await getMovieDetails(movie.id);
                    return { ...movie, ...details };
                }));
                setWatchlistMovies(moviesWithDetails);
            } catch (error) {
                console.error('Error fetching watchlist movies:', error);
            }
        };

        fetchWatchlistMovies();
    }, [username]);

    const sortMovies = (movies, type, asc) => {
        const sortedMovies = [...movies];
        sortedMovies.sort((a, b) => {
            let valueA, valueB;
            switch (type) {
                case 'release_date':
                    valueA = new Date(a.release_date);
                    valueB = new Date(b.release_date);
                    break;
                case 'rating':
                    valueA = a.vote_average || 0;
                    valueB = b.vote_average || 0;
                    break;
                case 'runtime':
                    valueA = a.runtime || 0;
                    valueB = b.runtime || 0;
                    break;
                case 'random':
                    return 0.5 - Math.random();
                default:
                    return 0;
            }
            return asc ? valueA - valueB : valueB - valueA;
        });
        return sortedMovies;
    };

    const sortedMovies = sortMovies(watchlistMovies, sortType, ascending);

    const getPosterUrl = (posterPath) => {
        return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : 'default-image-url';
    };

    const handleMovieClick = (id, event) => {
        if (!event.defaultPrevented) {
            navigate(`/movies/${id}`);
        }
    };

    return (
        <div>
            <div className="sorting-controls">
                <select value={sortType} onChange={(e) => setSortType(e.target.value)} className="sort-dropdown">
                    <option value="release_date">Release Date</option>
                    <option value="rating">Rating</option>
                    <option value="runtime">Film Length</option>
                    <option value="random">Random</option>
                </select>
                <button onClick={() => setAscending(!ascending)} className="sort-toggle">
                    {ascending ? (
                        <span>{sortType === 'release_date' ? 'Oldest First' : sortType === 'rating' ? 'Lowest First' : sortType === 'runtime' ? 'Shortest First' : 'Ascending'}</span>
                    ) : (
                        <span>{sortType === 'release_date' ? 'Newest First' : sortType === 'rating' ? 'Highest First' : sortType === 'runtime' ? 'Longest First' : 'Descending'}</span>
                    )}
                </button>
            </div>
            <div className="watchlist-movies">
                {sortedMovies.map(movie => (
                    <div key={movie.id} className="movie-card-watchlist" onClick={(e) => handleMovieClick(movie.id, e)}>
                        <img src={getPosterUrl(movie.poster_path)} alt={movie.title} className="movie-poster-watchlist" />
                        <MovieIconBar movie={movie} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Watchlist;
