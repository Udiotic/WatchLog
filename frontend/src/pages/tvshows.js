import React, { useEffect, useState, useRef } from 'react';
import './tvshows.css';
import Navbar from '../components/Navbar';
import { getPopularTVShows, getUpcomingTVShows } from '../api/tmdbApi';
import { useNavigate } from 'react-router-dom';

function TVShows() {
    const [popularTVShows, setPopularTVShows] = useState([]);
    const [upcomingTVShows, setUpcomingTVShows] = useState([]);
    const popularTVShowsRef = useRef(null);
    const upcomingTVShowsRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPopularTVShows = async () => {
            const shows = await getPopularTVShows();
            setPopularTVShows(shows);
        };

        const fetchUpcomingTVShows = async () => {
            const shows = await getUpcomingTVShows();
            setUpcomingTVShows(shows);
        };

        fetchPopularTVShows();
        fetchUpcomingTVShows();
    }, []);


    const scroll = (direction, ref) => {
        const scrollAmount = 1000; // Adjust scroll amount as needed
        if (direction === 'left') {
            ref.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleTVShowClick = (id) => {
        navigate(`/tvshows/${id}`);
    };

    return (
        <div className='tvshows-page'>
            <Navbar />
            <div className="tvshows-page-section">
                <span>Popular TV Shows</span>
                <div className="tvshows-page-wrapper">
                    <button className="scroll-button left" onClick={() => scroll('left', popularTVShowsRef)}>‹</button>
                    <div 
                        className="tvshows-page-container" 
                        ref={popularTVShowsRef}>
                        {popularTVShows.map(show => (
                            <div 
                                key={show.id} 
                                className="tvshows-page-card" 
                                onClick={() => handleTVShowClick(show.id)}
                            >
                                <img src={show.poster_path} alt={show.name} className="tvshows-page-poster" />
                            </div>
                        ))}
                    </div>
                    <button className="scroll-button right" onClick={() => scroll('right', popularTVShowsRef)}>›</button>
                </div>
            </div>
            <div className="tvshows-page-section">
                <span>Currently Airing</span>
                <div className="tvshows-page-wrapper">
                    <button className="scroll-button left" onClick={() => scroll('left', upcomingTVShowsRef)}>‹</button>
                    <div 
                        className="tvshows-page-container" 
                        ref={upcomingTVShowsRef}>
                        {upcomingTVShows.map(show => (
                            <div 
                                key={show.id} 
                                className="tvshows-page-card" 
                                onClick={() => handleTVShowClick(show.id)}
                            >
                                <img src={show.poster_path} alt={show.name} className="tvshows-page-poster" />
                            </div>
                        ))}
                    </div>
                    <button className="scroll-button right" onClick={() => scroll('right', upcomingTVShowsRef)}>›</button>
                </div>
            </div>
        </div>
    );
}

export default TVShows;
