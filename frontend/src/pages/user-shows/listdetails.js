import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './listDetailsShows.css';
import { getShowDetails } from '../../api/tmdbApi';

const ListDetailsShows = () => {
    const { username, listName } = useParams();
    const [list, setList] = useState(null);
    const [currentUserWatchedShows, setCurrentUserWatchedShows] = useState([]);
    const [sortType, setSortType] = useState('release_date');
    const [ascending, setAscending] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [newListName, setNewListName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchList = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/user/show-list/${username}/${listName}`);
                const uniqueShows = response.data.shows.filter((show, index, self) =>
                    index === self.findIndex((s) => s.id === show.id)
                );
                const showsWithDetails = await Promise.all(uniqueShows.map(async (show) => {
                    const details = await getShowDetails(show.id);
                    return { ...show, ...details };
                }));
                setList({ ...response.data, shows: showsWithDetails });
                setNewListName(response.data.name);
            } catch (error) {
                console.error('Error fetching list:', error);
            }
        };

        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const profileResponse = await axios.get('http://localhost:5001/api/user/profile', {
                        headers: { 'x-auth-token': token }
                    });
                    setIsLoggedIn(true);
                    setCurrentUser(profileResponse.data);
                    const watchedResponse = await axios.get(`http://localhost:5001/api/user/watched-shows/${profileResponse.data.username}`, {
                        headers: { 'x-auth-token': token }
                    });
                    setCurrentUserWatchedShows(watchedResponse.data);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Error fetching current user watched shows:', error);
            }
        };

        fetchList();
        fetchCurrentUser();
    }, [username, listName]);

    const sortShows = (shows, type, asc) => {
        const sortedShows = [...shows];
        sortedShows.sort((a, b) => {
            let valueA, valueB;
            switch (type) {
                case 'release_date':
                    valueA = a.first_air_date ? new Date(a.first_air_date) : new Date();
                    valueB = b.first_air_date ? new Date(b.first_air_date) : new Date();
                    break;
                case 'rating':
                    valueA = a.vote_average !== undefined ? a.vote_average : 0;
                    valueB = b.vote_average !== undefined ? b.vote_average : 0;
                    break;
                case 'runtime':
                    valueA = a.episode_run_time[0] !== undefined ? a.episode_run_time[0] : 0;
                    valueB = b.episode_run_time[0] !== undefined ? b.episode_run_time[0] : 0;
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

    const handleRenameList = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5001/api/user/rename-list-show`, { listId: list._id, newName: newListName }, {
                headers: { 'x-auth-token': token }
            });
            setList({ ...list, name: newListName });
            setEditMode(false);
        } catch (error) {
            console.error('Error renaming list:', error);
        }
    };

    const handleDeleteList = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5001/api/user/delete-list-show/${list._id}`, {
                headers: { 'x-auth-token': token }
            });
            navigate(`/profile/${username}/shows/lists`);
        } catch (error) {
            console.error('Error deleting list:', error);
        }
    };

    const handleRemoveShow = async (showId) => {
        try {
            const token = localStorage.getItem('token');
            const updatedShows = list.shows.filter(show => show.id !== showId);
            await axios.post(`http://localhost:5001/api/user/remove-show-from-list`, { listId: list._id, showId }, {
                headers: { 'x-auth-token': token }
            });
            setList({ ...list, shows: updatedShows });
        } catch (error) {
            console.error('Error removing show from list:', error);
        }
    };

    if (!list) return <div>Loading...</div>;

    const watchedShowIds = currentUserWatchedShows.map(show => show.id);
    const watchedCount = list.shows.filter(show => watchedShowIds.includes(show.id)).length;
    const totalShows = list.shows.length;
    const progressPercentage = totalShows ? (watchedCount / totalShows) * 100 : 0;

    return (
        <div className="list-details-page">
            <div className="header">
                <h2>{list.name}</h2>
                {isLoggedIn && currentUser.username === username && (
                    <div className="edit-buttons">
                        <button onClick={() => setEditMode(!editMode)} className="edit-button">Edit</button>
                        <button onClick={handleDeleteList} className="delete-button">Delete List</button>
                    </div>
                )}
            </div>
            {editMode && (
                <div className="edit-mode">
                    <input type="text" value={newListName} onChange={(e) => setNewListName(e.target.value)} />
                    <button onClick={handleRenameList} className="save-button">Save</button>
                </div>
            )}
            <div className="progress-container">
                <p>You have watched {watchedCount} out of {totalShows} shows</p>
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <span className="progress-percentage">{progressPercentage.toFixed(2)}%</span>
            </div>
            <div className="sorting-controls-container">
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
            </div>
            <div className="list-details-content">
                {sortShows(list.shows, sortType, ascending).map((show) => (
                    <div key={show.id} className="list-details-item">
                        {editMode && (
                            <button className="remove-show-button" onClick={() => handleRemoveShow(show.id)}>x</button>
                        )}
                        <img src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} alt={show.name} className="list-details-poster" onClick={() => !editMode && navigate(`/shows/${show.id}`)} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListDetailsShows;
