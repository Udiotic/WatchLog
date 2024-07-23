import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getMovieDetails } from '../api/tmdbApi';
import './Details.css';
import Navbar from "../components/Navbar";
import AddToListDialog from './AddToListDialog'; // Import the dialog
import defaultAvatar from '../images/default-avatar.png'; // Adjust the path accordingly
import { TbClockCheck } from 'react-icons/tb';


const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [lists, setLists] = useState([]);
    const [addToListDialogOpen, setAddToListDialogOpen] = useState(false);
    const [isWatched, setIsWatched] = useState(false); // State to track if the movie is watched
    const [isInWatchlist, setIsInWatchlist] = useState(false); // State to track if the movie is in watchlist
    const [reviews, setReviews] = useState([]);
    const username = localStorage.getItem('username'); // Assuming username is stored in local storage

    useEffect(() => {
        const fetchMovieDetails = async () => {
            const details = await getMovieDetails(id);
            setMovie(details);
        };

        const fetchUserLists = async () => {
            if (username) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`http://localhost:5000/api/user/movie-lists/${username}`, {
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
                    const response = await axios.get(`http://localhost:5000/api/user/watched-movies/${username}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': token
                        }
                    });
                    const watchedMovies = response.data;
                    setIsWatched(watchedMovies.some(m => m.id === parseInt(id)));
                } catch (error) {
                    console.error('Error fetching watched movies:', error);
                }
            }
        };

        const checkIfInWatchlist = async () => {
            if (username) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`http://localhost:5000/api/user/watchlist-movies/${username}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': token
                        }
                    });
                    const watchlistMovies = response.data;
                    setIsInWatchlist(watchlistMovies.some(m => m.id === parseInt(id)));
                } catch (error) {
                    console.error('Error fetching watchlist movies:', error);
                }
            }
        };

        const fetchReviews = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/api/user/reviews/movie/${id}`, {
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

        fetchMovieDetails();
        fetchUserLists();
        checkIfWatched();
        checkIfInWatchlist();
        fetchReviews();
    }, [id, username]);

    const toggleItem = async (listType) => {
        try {
            const log = {
                item: {
                    id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
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
                ? 'http://localhost:5000/api/user/toggle-watched-movies'
                : 'http://localhost:5000/api/user/toggle-watchlist-movies';

            const response = await axios.post(url, log, config);
            console.log('Response:', response);

            // Update state if the watched or watchlist was updated
            if (listType === 'watched') {
                setIsWatched(!isWatched);
            } else if (listType === 'watchlist') {
                setIsInWatchlist(!isInWatchlist);
            }
        } catch (error) {
            console.error(`Error toggling movie ${listType}`, error);
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

    if (!movie) return <div>Loading...</div>;

    return (
        <div className="movie-details-page">
            <Navbar />
            <div className="content-wrapper">
                <div className="main-content">
                    <div className="movie-info">
                        <div className="title-section">
                            <h1>{movie.title}</h1>
                            <span className="year">{movie.release_date.substring(0, 4)}</span>
                            <span className="runtime">{movie.runtime} Minutes</span>
                        </div>
                            <span className="director">
                                Directed by: {movie.credits.crew.filter(member => member.job === 'Director').map(director => director.name).join(', ')}
                            </span>
                        <p className="movie-overview">{movie.overview}</p>
                    </div>
                    <div className="poster-and-cast">
                        <div className="poster-container">
                            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="poster-image" />
                        </div>
                        <div className="cast-container">
                            <h2>Cast</h2>
                            <div className="cast-list">
                                {movie.credits.cast.slice(0, 9).map(member => (
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
                        {/* <TbClockCheck/> */}
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
                    movie={movie}
                    lists={lists}
                />
            )}
        </div>
    );
};

export default MovieDetails;
