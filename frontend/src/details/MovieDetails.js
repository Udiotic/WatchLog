import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getMovieDetails } from '../api/tmdbApi';
import './Details.css';
import Navbar from "../components/Navbar"

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            const details = await getMovieDetails(id);
            setMovie(details);
        };
        fetchMovieDetails();
    }, [id]);

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
            alert(`Movie ${listType} updated successfully`);
        } catch (error) {
            console.error(`Error toggling movie ${listType}`, error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
            }
        }
    };

    if (!movie) return <div>Loading...</div>;

    return (
        <div><Navbar/>
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
                <button onClick={() => toggleItem('watched')}>Watched</button>
                <button onClick={() => toggleItem('watchlist')}>Add to Watchlist</button>
            </div>
        </div>
        </div>
    );
};

export default MovieDetails;
