import React, { useEffect, useState, useRef } from 'react';
import './media.css';
import Navbar from '../components/Navbar';
import { getTrendingGames, getPopularGames } from '../api/rawgApi';
import { useNavigate } from 'react-router-dom';

function Games() {
    const [trendingGames, setTrendingGames] = useState([]);
    const [popularGames, setPopularGames] = useState([]);
    const trendingGamesRef = useRef(null);
    const popularGamesRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchGames() {
            setTrendingGames(await getTrendingGames());
            setPopularGames(await getPopularGames());
        }
        fetchGames();
    }, []);

    const scroll = (direction, ref) => {
        const scrollAmount = 800;
        if (direction === 'left') {
            ref.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleGameClick = (id) => {
        navigate(`/games/${id}`);
    };

    return (
        <div className='media-page'>
            <Navbar />
            <div className="media-section">
                <span>Trending This Week</span>
                <div className="media-wrapper">
                    <button className="scroll-button left" onClick={() => scroll('left', trendingGamesRef)}>‹</button>
                    <div className="media-container" ref={trendingGamesRef}>
                        {trendingGames.map(game => (
                            <div key={game.id} className="media-card" onClick={() => handleGameClick(game.id)}>
                                <img src={game.image} alt={game.name} className="media-poster" />
                                <div className="media-info">
                                    <h3>{game.name}</h3>
                                    <p>Released: {game.released}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="scroll-button right" onClick={() => scroll('right', trendingGamesRef)}>›</button>
                </div>
            </div>
            <div className="media-section">
                <span>All-Time Popular</span>
                <div className="media-wrapper">
                    <button className="scroll-button left" onClick={() => scroll('left', popularGamesRef)}>‹</button>
                    <div className="media-container" ref={popularGamesRef}>
                        {popularGames.map(game => (
                            <div key={game.id} className="media-card" onClick={() => handleGameClick(game.id)}>
                                <img src={game.image} alt={game.name} className="media-poster" />
                                <div className="media-info">
                                    <h3>{game.name}</h3>
                                    <p>Released: {game.released}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="scroll-button right" onClick={() => scroll('right', popularGamesRef)}>›</button>
                </div>
            </div>
        </div>
    );
}

export default Games;
