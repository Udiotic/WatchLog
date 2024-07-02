import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getMovieDetails } from '../api/tmdbApi';
import './Details.css';
import Navbar from "../components/Navbar";
import AddToListDialog from './AddToListDialog'; // Import the dialog

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [lists, setLists] = useState([]);
    const [addToListDialogOpen, setAddToListDialogOpen] = useState(false);
    const [isWatched, setIsWatched] = useState(false); // State to track if the movie is watched
    const [isInWatchlist, setIsInWatchlist] = useState(false); // State to track if the movie is in watchlist
    const username = localStorage.getItem('username'); // Assuming username is stored in local storage

    useEffect(() => {
        const fetchMovieDetails = async () => {
            const details = await getMovieDetails(id);
            setMovie(details);
        };
        fetchMovieDetails();

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
        fetchUserLists();

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

        checkIfWatched();
        checkIfInWatchlist();
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
        <div>
            <Navbar />
            <div className="details-page">
                <div className="content">
                    <div className="details-header">
                        <h1>{movie.title}</h1>
                        <span className="release-year">{movie.release_date.substring(0, 4)}</span>
                    </div>
                    <div className="details-body">
                        <div className="summary">{movie.overview}</div>
                    </div>
                </div>
                <div className="poster-container">
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="poster-image" />
                </div>
                <div className="options">
                    <button 
                        className={isWatched ? 'watched-button' : ''} 
                        onClick={() => toggleItem('watched')}
                    >
                        {isWatched ? '✔ Watched': 'Watched?'}
                    </button>
                    <button 
                        className={isInWatchlist ? 'watchlist-button' : ''} 
                        onClick={() => toggleItem('watchlist')}
                    >
                        {isInWatchlist ? '✔ Added to Watchlist' : 'Add to Watchlist'}
                    </button>
                    <button onClick={handleAddToList}>Add to List</button>
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
        </div>
    );
};

export default MovieDetails;
