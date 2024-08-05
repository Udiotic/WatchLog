import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './showsHome.css';
import ShowSearchDialog from './ShowSearchDialog';

const ShowsHome = () => {
    const { username } = useParams();
    const [counts, setCounts] = useState({
        completed: 0,
        watching: 0,
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

                const completedResponse = await axios.get(`http://localhost:5001/api/user/completed-shows/${username}`, {
                    headers: { 'x-auth-token': token }
                });

                const watchingResponse = await axios.get(`http://localhost:5001/api/user/watching-shows/${username}`, {
                    headers: { 'x-auth-token': token }
                });

                const watchlistResponse = await axios.get(`http://localhost:5001/api/user/watchlist-shows/${username}`, {
                    headers: { 'x-auth-token': token }
                });

                const listsResponse = await axios.get(`http://localhost:5001/api/user/show-lists/${username}`, {
                    headers: { 'x-auth-token': token }
                });

                const journalResponse = await axios.get(`http://localhost:5001/api/user/journal-entries/${username}`, {
                    headers: { 'x-auth-token': token }
                });

                const reviewCount = journalResponse.data.filter(entry => entry.review && entry.review.trim().length > 0).length;

                setCounts({
                    completed: completedResponse.data.length,
                    watching: watchingResponse.data.length,
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
                const response = await axios.get('http://localhost:5001/api/user/profile', {
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
                const response = await axios.get(`http://localhost:5001/api/user/favorite-shows/${username}/${timeframe}`);
                console.log('Fetched favorites:', response.data); // Debug log
                
                setFavorites(response.data);
            } catch (error) {
                console.error('Error fetching favorite shows:', error);
            }
        };

        fetchFavorites();
    }, [username, timeframe]);

    const handleAddFavorite = async (show) => {
        if (show) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.post(`http://localhost:5001/api/user/favorite-shows/${timeframe}`, { show }, {
                    headers: { 'x-auth-token': token }
                });
                console.log('Added favorite:', response.data); // Debug log
                setFavorites(response.data);
                setSearchDialogOpen(false);
            } catch (error) {
                console.error('Error adding favorite show:', error);
            }
        } else {
            setSearchDialogOpen(false);
        }
    };

    const handleRemoveFavorite = async (showId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:5001/api/user/remove-favorite-show/${timeframe}`, { showId }, {
                headers: { 'x-auth-token': token }
            });
            console.log('Removed favorite:', response.data); // Debug log
            setFavorites(response.data);
        } catch (error) {
            console.error('Error removing favorite show:', error);
        }
    };

    const openSearchDialog = () => {
        setSearchDialogOpen(true);
    };

    const handleShowClick = (showId) => {
        console.log('Navigating to showId:', showId); // Debug log
        navigate(`/tvshows/${showId}`);
    };

    return (
        <div className="shows-home">
            <div className="counts">
                <Link to={`/profile/${username}/shows/completed`}>
                    Completed <span>{counts.completed}</span>
                </Link>
                <Link to={`/profile/${username}/shows/watching`}>
                    Watching <span>{counts.watching}</span>
                </Link>
                <Link to={`/profile/${username}/shows/watchlist`}>
                    Watchlist <span>{counts.watchlist}</span>
                </Link>
                <Link to={`/profile/${username}/shows/journal`}>
                    Reviews <span>{counts.reviews}</span>
                </Link>
                <Link to={`/profile/${username}/shows/lists`}>
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
                        <div key={index} className="favorite-show-card">
                            {favorites[index] ? (
                                <>
                                    <div className="favorite-show-card-content" onClick={() => handleShowClick(favorites[index]._id)}>
                                        
                                        <img src={`https://image.tmdb.org/t/p/w500${favorites[index].poster_path}`} alt={favorites[index].title} />
                                    </div>
                                    {isCurrentUser && (
                                        <span className="remove-show" onClick={() => handleRemoveFavorite(favorites[index].showId)}>x</span>
                                    )}
                                </>
                            ) : (
                                isCurrentUser && (
                                    <div className="favorite-show-card-content" onClick={openSearchDialog}>
                                        <span>+</span>
                                    </div>
                                )
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {searchDialogOpen && <ShowSearchDialog open={searchDialogOpen} onClose={handleAddFavorite} />}
        </div>
    );
};

export default ShowsHome;
