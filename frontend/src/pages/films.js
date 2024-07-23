import React, { useEffect, useState, useRef } from 'react';
import './films.css';
import Navbar from '../components/Navbar';
import { getPopularMovies, getUpcomingMovies } from '../api/tmdbApi';
import { useNavigate } from 'react-router-dom';
import MovieIconBar from '../components/MovieIconBar'; // Import the new component

function Films() {
    const [popularMovies, setPopularMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
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

        fetchPopularMovies();
        fetchUpcomingMovies();
    }, []);

    const scroll = (direction, ref) => {
        const scrollAmount = 800; // Adjust scroll amount as needed
        if (direction === 'left') {
            ref.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleMovieClick = (id, event) => {
        if (!event.defaultPrevented) {
            navigate(`/movies/${id}`);
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
                            <div key={movie.id} className="films-page-movie-card" onClick={(e) => handleMovieClick(movie.id, e)}>
                                <img src={movie.poster_path} alt={movie.title} className="films-page-movie-poster" />
                                <MovieIconBar movie={movie} username={username} token={token} /> {/* Use the new component */}
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
                            <div key={movie.id} className="films-page-movie-card" onClick={(e) => handleMovieClick(movie.id, e)}>
                                <img src={movie.poster_path} alt={movie.title} className="films-page-movie-poster" />
                                <MovieIconBar movie={movie} username={username} token={token} /> {/* Use the new component */}
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
