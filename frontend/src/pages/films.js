import React, { useEffect, useState, useRef } from 'react';
import './films.css';
import Navbar from '../components/Navbar';
import { getPopularMovies, getUpcomingMovies } from '../api/tmdbApi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheckDouble, FaPlus, FaHeart } from 'react-icons/fa';

function Films() {
    const [popularMovies, setPopularMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [watchedMovies, setWatchedMovies] = useState([]);
    const [likedMovies, setLikedMovies] = useState([]);
    const popularMoviesRef = useRef(null);
    const upcomingMoviesRef = useRef(null);
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchPopularMovies = async () => {
            const movies = await getPopularMovies();
            setPopularMovies(movies);
        };

        const fetchUpcomingMovies = async () => {
            const movies = await getUpcomingMovies();
            setUpcomingMovies(movies);
        };

        const fetchUserMovies = async () => {
            try {
                const watchedResponse = await axios.get(`http://localhost:5000/api/user/watched-movies/${username}`, {
                    headers: { 'x-auth-token': token }
                });
                setWatchedMovies(watchedResponse.data);

                const likedResponse = await axios.get(`http://localhost:5000/api/user/liked-movies/${username}`, {
                    headers: { 'x-auth-token': token }
                });
                setLikedMovies(likedResponse.data);
            } catch (error) {
                console.error('Error fetching user movies:', error);
            }
        };

        fetchPopularMovies();
        fetchUpcomingMovies();
        fetchUserMovies();
    }, [username, token]);

    const isMovieWatched = (movieId) => {
        return watchedMovies.some(movie => movie.id === movieId);
    };

    const isMovieLiked = (movieId) => {
        return likedMovies.some(movie => movie.id === movieId);
    };

    const scroll = (direction, ref) => {
        const scrollAmount = 1000; // Adjust scroll amount as needed
        if (direction === 'left') {
            ref.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleMovieClick = (id) => {
        navigate(`/movies/${id}`);
    };

    const toggleWatched = async (movie, event) => {
        event.stopPropagation(); // Prevent navigation
        try {
            const response = await axios.post(
                'http://localhost:5000/api/user/toggle-watched-movies',
                { item: movie },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token,
                    },
                }
            );
            setWatchedMovies(response.data);
        } catch (error) {
            console.error('Error toggling watched movie:', error);
        }
    };

    const toggleWatchlist = async (movie, event) => {
        event.stopPropagation(); // Prevent navigation
        try {
            const response = await axios.post(
                'http://localhost:5000/api/user/toggle-watchlist-movies',
                { item: movie },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token,
                    },
                }
            );
            console.log('Toggled watchlist movie:', response.data);
        } catch (error) {
            console.error('Error toggling watchlist movie:', error);
        }
    };

    const toggleLiked = async (movie, event) => {
        event.stopPropagation(); // Prevent navigation
        try {
            const response = await axios.post(
                'http://localhost:5000/api/user/toggle-liked-movies',
                { item: movie },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token,
                    },
                }
            );
            setLikedMovies(response.data);
        } catch (error) {
            console.error('Error toggling liked movie:', error);
        }
    };

    return (
        <div className='films-page'>
            <Navbar />
            <div className="films-page-movies-section">
                <span>Trending this week</span>
                <div className="films-page-movies-wrapper">
                    <button className="scroll-button left" onClick={() => scroll('left', popularMoviesRef)}>‹</button>
                    <div className="films-page-movies-container" ref={popularMoviesRef}>
                        {popularMovies.map(movie => (
                            <div key={movie.id} className="films-page-movie-card" onClick={() => handleMovieClick(movie.id)}>
                                <img src={movie.poster_path} alt={movie.title} className="films-page-movie-poster" />
                                <div className="movie-icons">
                                    <span onClick={(e) => toggleWatched(movie, e)} className="icon watched">
                                        <FaCheckDouble color={isMovieWatched(movie.id) ? 'blue' : 'grey'} />
                                    </span>
                                    <span onClick={(e) => toggleWatchlist(movie, e)} className="icon watchlist">
                                        <FaPlus />
                                    </span>
                                    <span onClick={(e) => toggleLiked(movie, e)} className="icon favorite">
                                        <FaHeart color={isMovieLiked(movie.id) ? 'red' : 'grey'} />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="scroll-button right" onClick={() => scroll('right', popularMoviesRef)}>›</button>
                </div>
            </div>
            <div className="films-page-movies-section">
                <span>Upcoming Movies</span>
                <div className="films-page-movies-wrapper">
                    <button className="scroll-button left" onClick={() => scroll('left', upcomingMoviesRef)}>‹</button>
                    <div className="films-page-movies-container" ref={upcomingMoviesRef}>
                        {upcomingMovies.map(movie => (
                            <div key={movie.id} className="films-page-movie-card" onClick={() => handleMovieClick(movie.id)}>
                                <img src={movie.poster_path} alt={movie.title} className="films-page-movie-poster" />
                                <div className="movie-icons">
                                    <span onClick={(e) => toggleWatched(movie, e)} className="icon watched">
                                        <FaCheckDouble color={isMovieWatched(movie.id) ? 'blue' : 'grey'} />
                                    </span>
                                    <span onClick={(e) => toggleWatchlist(movie, e)} className="icon watchlist">
                                        <FaPlus />
                                    </span>
                                    <span onClick={(e) => toggleLiked(movie, e)} className="icon favorite">
                                        <FaHeart color={isMovieLiked(movie.id) ? 'red' : 'grey'} />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="scroll-button right" onClick={() => scroll('right', upcomingMoviesRef)}>›</button>
                </div>
            </div>
        </div>
    );
}

export default Films;
