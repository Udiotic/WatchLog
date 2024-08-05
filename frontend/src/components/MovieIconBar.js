import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHeart } from 'react-icons/fa';
import { RiCheckDoubleLine } from 'react-icons/ri';
import { TbClockCheck } from 'react-icons/tb';

const MovieIconBar = ({ movie }) => {
    const [watched, setWatched] = useState(false);
    const [liked, setLiked] = useState(false);
    const [inWatchlist, setInWatchlist] = useState(false);
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    useEffect(() => {
        const fetchUserMovieStatus = async () => {
            if (!movie.id) {
                console.error("Movie id is missing.");
                return;
            }
            try {
                const watchedResponse = await axios.get(`http://localhost:5001/api/user/watched-movies/${username}`, {
                    headers: { 'x-auth-token': token }
                });
                setWatched(watchedResponse.data.some(m => m.id === movie.id));

                const likedResponse = await axios.get(`http://localhost:5001/api/user/liked-movies/${username}`, {
                    headers: { 'x-auth-token': token }
                });
                setLiked(likedResponse.data.some(m => m.id === movie.id));

                const watchlistResponse = await axios.get(`http://localhost:5001/api/user/watchlist-movies/${username}`, {
                    headers: { 'x-auth-token': token }
                });
                setInWatchlist(watchlistResponse.data.some(m => m.id === movie.id));
            } catch (error) {
                console.error('Error fetching movie status:', error);
            }
        };

        fetchUserMovieStatus();
    }, [movie.id, token, username]);

    const toggleWatched = async (event) => {
        event.stopPropagation(); // Prevent navigation
        if (!movie.id) {
            console.error("Movie id is missing.");
            return;
        }
        try {
            const response = await axios.post(
                'http://localhost:5001/api/user/toggle-watched-movies',
                { item: movie },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token,
                    },
                }
            );
            setWatched(response.data.some(m => m.id === movie.id));
        } catch (error) {
            console.error('Error toggling watched movie:', error);
        }
    };

    const toggleWatchlist = async (event) => {
        event.stopPropagation(); // Prevent navigation
        if (!movie.id) {
            console.error("Movie id is missing.");
            return;
        }
        try {
            const response = await axios.post(
                'http://localhost:5001/api/user/toggle-watchlist-movies',
                { item: movie },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token,
                    },
                }
            );
            setInWatchlist(response.data.some(m => m.id === movie.id));
        } catch (error) {
            console.error('Error toggling watchlist movie:', error);
        }
    };

    const toggleLiked = async (event) => {
        event.stopPropagation(); // Prevent navigation
        if (!movie.id) {
            console.error("Movie id is missing.");
            return;
        }
        try {
            const response = await axios.post(
                'http://localhost:5001/api/user/toggle-liked-movies',
                { item: movie },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token,
                    },
                }
            );
            setLiked(response.data.some(m => m.id === movie.id));
        } catch (error) {
            console.error('Error toggling liked movie:', error);
        }
    };

    return (
        <div className="movie-icons">
            <span onClick={toggleWatched} className="icon-watched">
                <RiCheckDoubleLine color={watched ? 'green' : 'grey'} />
            </span>
            <span onClick={toggleWatchlist} className="icon-watchlist">
                <TbClockCheck color={inWatchlist ? 'blue' : 'grey'} />
            </span>
            <span onClick={toggleLiked} className="icon-favorite">
                <FaHeart color={liked ? 'red' : 'grey'} />
            </span>
        </div>
    );
};

export default MovieIconBar;
