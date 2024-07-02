import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './watched.css';
import { getMovieDetails } from '../../api/tmdbApi'; // Import the function to get movie details from TMDB

const Watched = () => {
    const { username } = useParams();
    const [watchedMovies, setWatchedMovies] = useState([]);
    const [sortType, setSortType] = useState('release_date');
    const [ascending, setAscending] = useState(false);

    useEffect(() => {
        const fetchWatchedMovies = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/user/watched-movies/${username}`);
                const moviesWithDetails = await Promise.all(response.data.map(async (movie) => {
                    const details = await getMovieDetails(movie.id);
                    return { ...movie, ...details };
                }));
                setWatchedMovies(moviesWithDetails);
            } catch (error) {
                console.error('Error fetching watched movies:', error);
            }
        };

        fetchWatchedMovies();
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
                    valueA = a.vote_average || 0; // Use TMDB rating
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

    const sortedMovies = sortMovies(watchedMovies, sortType, ascending);

    const getPosterUrl = (posterPath) => {
        return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : 'default-image-url';
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
            <div className="watched-movies">
                {sortedMovies.map(movie => (
                    <Link key={movie.id} to={`/movies/${movie.id}`}>
                        <div className="movie-card">
                            <img src={getPosterUrl(movie.poster_path)} alt={movie.title} className="movie-poster" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Watched;
