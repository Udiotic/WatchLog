import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getTVShowDetails } from '../api/tmdbApi';
import './Details.css';
import Navbar from "../components/Navbar"


const TVShowDetails = () => {
    const { id } = useParams();
    const [tvShow, setTVShow] = useState(null);

    useEffect(() => {
        const fetchTVShowDetails = async () => {
            const details = await getTVShowDetails(id);
            setTVShow(details);
        };
        fetchTVShowDetails();
    }, [id]);

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
            alert(`TV Show ${listType} updated successfully`);
        } catch (error) {
            console.error(`Error toggling TV Show ${listType}`, error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
            }
        }
    };

    if (!tvShow) return <div>Loading...</div>;

    return (
        <div><Navbar/>
        <div className="details-page">
            <div className="content">
                <div className="details-header">
                    <h1>{tvShow.name}</h1>
                    <span className="release-year">{tvShow.first_air_date.substring(0, 4)}</span>
                </div>
                <div className="details-body">
                    <div className="summary">{tvShow.overview}</div>
                </div>
            </div>
            <div className="poster-container">
                <img src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`} alt={tvShow.name} className="poster-image" />
            </div>
            <div className="options">
                <button onClick={() => toggleItem('watched')}>Watched</button>
                <button onClick={() => toggleItem('watchlist')}>Add to Watchlist</button>
            </div>
        </div>
        </div>
    );
};

export default TVShowDetails;
