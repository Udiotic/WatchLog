import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './filmshome.css';
import MovieSearchDialog from './MovieSearchDialog';

const FilmsHome = () => {
    const { username } = useParams();
    const [counts, setCounts] = useState({
        watched: 0,
        watchlist: 0,
        reviews: 0,
        lists: 0
    });
    const [favorites, setFavorites] = useState([]);
    const [timeframe, setTimeframe] = useState('allTime');
    const [searchDialogOpen, setSearchDialogOpen] = useState(false);
    const navigate = useNavigate();
    const [isCurrentUser, setIsCurrentUser] = useState(false);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const token = localStorage.getItem('token');

                const watchedResponse = await axios.get(`http://localhost:5000/api/user/watched-movies/${username}`, {
                    headers: { 'x-auth-token': token }
                });

                const watchlistResponse = await axios.get(`http://localhost:5000/api/user/watchlist-movies/${username}`, {
                    headers: { 'x-auth-token': token }
                });

                const listsResponse = await axios.get(`http://localhost:5000/api/user/movie-lists/${username}`, {
                    headers: { 'x-auth-token': token }
                });

                const journalResponse = await axios.get(`http://localhost:5000/api/user/journal-entries/${username}`, {
                    headers: { 'x-auth-token': token }
                });

                const reviewCount = journalResponse.data.filter(entry => entry.review && entry.review.trim().length > 0).length;

                setCounts({
                    watched: watchedResponse.data.length,
                    watchlist: watchlistResponse.data.length,
                    reviews: reviewCount,
                    lists: listsResponse.data.length
                });
            } catch (error) {
                console.error('Error fetching counts:', error);
            }
        };

        const checkCurrentUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/user/profile', {
                    headers: { 'x-auth-token': token }
                });
                setIsCurrentUser(response.data.username === username);
            } catch (error) {
                console.error('Error checking current user:', error);
            }
        };

        fetchCounts();
        checkCurrentUser();
    }, [username]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/user/favorite-movies/${username}/${timeframe}`);
                setFavorites(response.data);
            } catch (error) {
                console.error('Error fetching favorite movies:', error);
            }
        };

        fetchFavorites();
    }, [username, timeframe]);

    const handleAddFavorite = async (movie) => {
        if (movie) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.post(`http://localhost:5000/api/user/favorite-movies/${timeframe}`, { movie }, {
                    headers: { 'x-auth-token': token }
                });
                setFavorites(response.data);
                setSearchDialogOpen(false);
            } catch (error) {
                console.error('Error adding favorite movie:', error);
            }
        }
    };

    const handleRemoveFavorite = async (movieId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:5000/api/user/remove-favorite-movie/${timeframe}`, { movieId }, {
                headers: { 'x-auth-token': token }
            });
            setFavorites(response.data);
        } catch (error) {
            console.error('Error removing favorite movie:', error);
        }
    };

    const openSearchDialog = () => {
        setSearchDialogOpen(true);
    };

    return (
        <div className="films-home">
            <div className="counts">
                <Link to={`/profile/${username}/films/watched`}>
                    Watched <span>{counts.watched}</span>
                </Link>
                <Link to={`/profile/${username}/films/watchlist`}>
                    Watchlist <span>{counts.watchlist}</span>
                </Link>
                <Link to={`/profile/${username}/films/journal`}>
                    Reviews <span>{counts.reviews}</span>
                </Link>
                <Link to={`/profile/${username}/films/lists`}>
                    Lists <span>{counts.lists}</span>
                </Link>
            </div>
            <div className="favorites">
                <h2>Favorites of</h2>
                <select onChange={(e) => setTimeframe(e.target.value)} value={timeframe}>
                    <option value="allTime">All-time</option>
                    <option value="year">Year</option>
                    <option value="month">Month</option>
                    <option value="week">Week</option>
                </select>
                <div className="favorites-list">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="favorite-movie-card">
                            {favorites[index] ? (
                                <>
                                    <div className="favorite-movie-card-content" onClick={() => navigate(`/movies/${favorites[index].movieId}`)}>
                                        <img src={`https://image.tmdb.org/t/p/w500${favorites[index].poster_path}`} alt={favorites[index].title} />
                                    </div>
                                    {isCurrentUser && (
                                        <span className="remove-movie" onClick={() => handleRemoveFavorite(favorites[index].movieId)}>x</span>
                                    )}
                                </>
                            ) : (
                                isCurrentUser && (
                                    <div className="favorite-movie-card-content" onClick={openSearchDialog}>
                                        <span>+</span>
                                    </div>
                                )
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {searchDialogOpen && <MovieSearchDialog open={searchDialogOpen} onClose={handleAddFavorite} />}
        </div>
    );
};

export default FilmsHome;
