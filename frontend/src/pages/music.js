import React, { useEffect, useState, useRef } from 'react';
import './media.css';
import Navbar from '../components/Navbar';
import { getTrendingMusic, getPopularMusic } from '../api/lastfmApi';
import { useNavigate } from 'react-router-dom';

function Music() {
    const [trendingMusic, setTrendingMusic] = useState([]);
    const [popularMusic, setPopularMusic] = useState([]);
    const trendingMusicRef = useRef(null);
    const popularMusicRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchMusic() {
            setTrendingMusic(await getTrendingMusic());
            setPopularMusic(await getPopularMusic());
        }
        fetchMusic();
    }, []);

    const scroll = (direction, ref) => {
        const scrollAmount = 800;
        if (direction === 'left') {
            ref.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleMusicClick = (id) => {
        navigate(`/music/${id}`);
    };

    return (
        <div className='media-page'>
            <Navbar />
            <div className="media-section">
                <span>Trending This Week</span>
                <div className="media-wrapper">
                    <button className="scroll-button left" onClick={() => scroll('left', trendingMusicRef)}>‹</button>
                    <div className="media-container" ref={trendingMusicRef}>
                        {trendingMusic.map(music => (
                            <div key={music.id} className="media-card" onClick={() => handleMusicClick(music.id)}>
                                <img src={music.image} alt={music.name} className="media-poster" />
                                <div className="media-info">
                                    <h3>{music.name}</h3>
                                    <p>Artist: {music.artist}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="scroll-button right" onClick={() => scroll('right', trendingMusicRef)}>›</button>
                </div>
            </div>
            <div className="media-section">
                <span>All-Time Popular</span>
                <div className="media-wrapper">
                    <button className="scroll-button left" onClick={() => scroll('left', popularMusicRef)}>‹</button>
                    <div className="media-container" ref={popularMusicRef}>
                        {popularMusic.map(music => (
                            <div key={music.id} className="media-card" onClick={() => handleMusicClick(music.id)}>
                                <img src={music.image} alt={music.name} className="media-poster" />
                                <div className="media-info">
                                    <h3>{music.name}</h3>
                                    <p>Artist: {music.artist}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="scroll-button right" onClick={() => scroll('right', popularMusicRef)}>›</button>
                </div>
            </div>
        </div>
    );
}

export default Music;
