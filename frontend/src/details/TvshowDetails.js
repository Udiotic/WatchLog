import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getTVShowDetails } from '../api/tmdbApi';
import './TVShowDetails.css';
import Navbar from "../components/Navbar";
import AddToListDialog from './AddToListDialog'; // Import the dialog
import defaultAvatar from '../images/default-avatar.png'; // Adjust the path accordingly

const TVShowDetails = () => {
    const { id } = useParams();
    const [tvShow, setTVShow] = useState(null);
    const [lists, setLists] = useState([]);
    const [addToListDialogOpen, setAddToListDialogOpen] = useState(false);
    const [isWatched, setIsWatched] = useState(false); // State to track if the TV show is watched
    const [isInWatchlist, setIsInWatchlist] = useState(false); // State to track if the TV show is in watchlist
    const [reviews, setReviews] = useState([]);
    const username = localStorage.getItem('username'); // Assuming username is stored in local storage

    useEffect(() => {
        const fetchTVShowDetails = async () => {
            const details = await getTVShowDetails(id);
            setTVShow(details);
        };

        const fetchUserLists = async () => {
            if (username) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`http://localhost:5000/api/user/tvshow-lists/${username}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': token
                        }
                    });
                    setLists(response.data);
                } catch (error) {
                    console.error('Error fetching user lists:', error);
                }
            }
        };

        const checkIfWatched = async () => {
            if (username) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`http://localhost:5000/api/user/watched-tvshows/${username}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': token
                        }
                    });
                    const watchedTVShows = response.data;
                    setIsWatched(watchedTVShows.some(m => m.id === parseInt(id)));
                } catch (error) {
                    console.error('Error fetching watched TV shows:', error);
                }
            }
        };

        const checkIfInWatchlist = async () => {
            if (username) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`http://localhost:5000/api/user/watchlist-tvshows/${username}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': token
                        }
                    });
                    const watchlistTVShows = response.data;
                    setIsInWatchlist(watchlistTVShows.some(m => m.id === parseInt(id)));
                } catch (error) {
                    console.error('Error fetching watchlist TV shows:', error);
                }
            }
        };

        const fetchReviews = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/api/user/reviews/tvshow/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    }
                });
                setReviews(response.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchTVShowDetails();
        fetchUserLists();
        checkIfWatched();
        checkIfInWatchlist();
        fetchReviews();
    }, [id, username]);

    const toggleItem = async (listType) => {
        try {
            const log = {
                item: {
                    id: tvShow.id,
                    title: tvShow.name,
                    poster_path: tvShow.poster_path,
                },
            };

            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
            };

            const url = listType === 'watched'
                ? 'http://localhost:5000/api/user/toggle-watched-tvshows'
                : 'http://localhost:5000/api/user/toggle-watchlist-tvshows';

            const response = await axios.post(url, log, config);
            console.log('Response:', response);

            // Update state if the watched or watchlist was updated
            if (listType === 'watched') {
                setIsWatched(!isWatched);
            } else if (listType === 'watchlist') {
                setIsInWatchlist(!isInWatchlist);
            }
        } catch (error) {
            console.error(`Error toggling TV show ${listType}`, error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
            }
        }
    };

    const handleAddToList = () => {
        setAddToListDialogOpen(true);
    };

    const handleAddToListDialogClose = (updatedLists) => {
        setAddToListDialogOpen(false);
        if (updatedLists) {
            setLists(updatedLists);
        }
    };

    if (!tvShow) return <div>Loading...</div>;

    return (
        <div className="tvshow-details-page">
            <Navbar />
            <div className="content-wrapper">
                <div className="main-content">
                    <div className="tvshow-info">
                        <div className="title-section">
                            <h1>{tvShow.name}</h1>
                            <span className="year">{tvShow.first_air_date.substring(0, 4)}</span>
                        </div>
                        <p className="tvshow-overview">{tvShow.overview}</p>
                    </div>
                    <div className="poster-and-cast">
                        <div className="poster-container">
                            <img src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`} alt={tvShow.name} className="poster-image" />
                        </div>
                        <div className="cast-container">
                            <h2>Cast</h2>
                            <div className="cast-list">
                                {tvShow.credits.cast.slice(0, 9).map(member => (
                                    <div key={member.cast_id} className="cast-member">
                                        <img src={member.profile_path ? `https://image.tmdb.org/t/p/w200${member.profile_path}` : defaultAvatar} alt={member.name} />
                                        <p>{member.name} as {member.character}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="options-tab">
                    <h2>Options</h2>
                    <button
                        className={isWatched ? 'watched-button' : ''}
                        onClick={() => toggleItem('watched')}
                    >
                        {isWatched ? '✔ Watched' : 'Watched?'}
                    </button>
                    <button
                        className={isInWatchlist ? 'watchlist-button' : ''}
                        onClick={() => toggleItem('watchlist')}
                    >
                        {isInWatchlist ? '✔ Added to Watchlist' : 'Add to Watchlist'}
                    </button>
                    <button onClick={handleAddToList}>Add to List</button>
                </div>
            </div>
            <div className="reviews-section">
                <h2>Popular Reviews</h2>
                {reviews.length > 0 ? (
                    reviews.map(review => (
                        <div key={review._id} className="review">
                            <div className="review-header">
                                <img 
                                    src={review.user.pfp ? `data:image/png;base64,${review.user.pfp}` : defaultAvatar} 
                                    alt={review.user.username} 
                                    className="review-avatar" 
                                />
                                <div className="review-header-text">
                                    <span className="review-username">Review by {review.user.username}</span>
                                    <span className="rating">★★★½</span>
                                </div>
                            </div>
                            <p>{review.review}</p>
                            <div className="review-footer">
                                <span className="like-review">
                                    {/* Add your like icon SVG here */}
                                    Like review
                                </span>
                                <span className="likes-count">{review.likes || 0} likes</span>
                                <span className="comment-count">{review.comments || 0}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No reviews yet</p>
                )}
            </div>
            {addToListDialogOpen && (
                <AddToListDialog
                    open={addToListDialogOpen}
                    onClose={handleAddToListDialogClose}
                    tvShow={tvShow}
                    lists={lists}
                />
            )}
        </div>
    );
};

export default TVShowDetails;
