import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getGameDetails } from '../api/rawgApi';
import './Details.css';
import Navbar from "../components/Navbar"


const GameDetails = () => {
    const { id } = useParams();
    const [game, setGame] = useState(null);

    useEffect(() => {
        const fetchGameDetails = async () => {
            const details = await getGameDetails(id);
            setGame(details);
        };
        fetchGameDetails();
    }, [id]);

    const toggleItem = async (listType) => {
        try {
            const log = {
                item: {
                    id: game.id,
                    title: game.name,
                    poster_path: game.background_image,
                },
            };

            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
            };

            const url = listType === 'played'
                ? 'http://localhost:5000/api/user/toggle-played-games'
                : 'http://localhost:5000/api/user/toggle-gamelist-games';

            const response = await axios.post(url, log, config);
            console.log('Response:', response);
            alert(`Game ${listType} updated successfully`);
        } catch (error) {
            console.error(`Error toggling game ${listType}`, error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
            }
        }
    };

    if (!game) return <div>Loading...</div>;

    return (
        <div><Navbar/>
        <div className="details-page">
            <div className="content">
                <div className="details-header">
                    <h1>{game.name}</h1>
                    <span className="release-year">{game.released.substring(0, 4)}</span>
                </div>
                <div className="details-body">
                    <div className="summary">{game.description_raw}</div>
                </div>
            </div>
            <div className="poster-container">
                <img src={game.background_image} alt={game.name} className="poster-image" />
            </div>
            <div className="options">
                <button onClick={() => toggleItem('played')}>Played</button>
                <button onClick={() => toggleItem('gamelist')}>Add to Game List</button>
            </div>
        </div>
        </div>
    );
};

export default GameDetails;
