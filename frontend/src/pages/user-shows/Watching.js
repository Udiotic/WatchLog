import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './watchingShows.css';
import { getTVShowDetails } from '../../api/tmdbApi';

const WatchingShows = () => {
    const { username } = useParams();
    const [watchingShows, setWatchingShows] = useState([]);
    const [sortType, setSortType] = useState('release_date');
    const [ascending, setAscending] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWatchingShows = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/user/watching-shows/${username}`);
                const showsWithDetails = await Promise.all(response.data.map(async (show) => {
                    const details = await getTVShowDetails(show.id);
                    return { ...show, ...details };
                }));
                setWatchingShows(showsWithDetails);
            } catch (error) {
                console.error('Error fetching watching shows:', error);
            }
        };

        fetchWatchingShows();
    }, [username]);

    const sortShows = (shows, type, asc) => {
        const sortedShows = [...shows];
        sortedShows.sort((a, b) => {
            let valueA, valueB;
            switch (type) {
                case 'release_date':
                    valueA = new Date(a.first_air_date);
                    valueB = new Date(b.first_air_date);
                    break;
                case 'rating':
                    valueA = a.vote_average || 0;
                    valueB = b.vote_average || 0;
                    break;
                case 'runtime':
                    valueA = a.episode_run_time[0] || 0;
                    valueB = b.episode_run_time[0] || 0;
                    break;
                case 'random':
                    return 0.5 - Math.random();
                default:
                    return 0;
            }
            return asc ? valueA - valueB : valueB - valueA;
        });
        return sortedShows;
    };

    const sortedShows = sortShows(watchingShows, sortType, ascending);

    const getPosterUrl = (posterPath) => {
        return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : 'default-image-url';
    };

    const handleShowClick = (id, event) => {
        if (!event.defaultPrevented) {
            navigate(`/tvshows/${id}`);
        }
    };

    return (
        <div>
            <div className="sorting-controls">
                <select value={sortType} onChange={(e) => setSortType(e.target.value)} className="sort-dropdown">
                    <option value="release_date">Release Date</option>
                    <option value="rating">Rating</option>
                    <option value="runtime">Episode Length</option>
                    <option value="random">Random</option>
                </select>
                <button onClick={() => setAscending(!ascending)} className="sort-toggle">
                    {ascending ? (
                        <span>{sortType === 'release_date' ? 'Oldest First' : sortType === 'rating' ? 'Lowest First' : sortType === 'runtime' ? 'Shortest First' : 'Ascending'}</span>
                    ) : (
                        <span>{sortType === 'release_date' ? 'Newest First' : sortType === 'rating' ? 'Highest First' : sortType === 'runtime' ? 'Longest First' : 'Descending'}</span>
                    )}
                </button>
            </div>
            <div className="watching-shows">
                {sortedShows.map(show => (
                    <div key={show.id} className="show-card" onClick={(e) => handleShowClick(show.id, e)}>
                        <img src={getPosterUrl(show.poster_path)} alt={show.name} className="show-poster" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WatchingShows;
