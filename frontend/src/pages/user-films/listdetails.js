import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './listdetails.css';
import { getMovieDetails } from '../../api/tmdbApi';

const ListDetails = () => {
    const { username, listName } = useParams();
    const [list, setList] = useState(null);
    const [currentUserWatchedMovies, setCurrentUserWatchedMovies] = useState([]);
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
                const response = await axios.get(`http://localhost:5000/api/user/movie-list/${username}/${listName}`);
                const uniqueMovies = response.data.movies.filter((movie, index, self) =>
                    index === self.findIndex((m) => m.id === movie.id)
                );
                const moviesWithDetails = await Promise.all(uniqueMovies.map(async (movie) => {
                    const details = await getMovieDetails(movie.id);
                    return { ...movie, ...details };
                }));
                setList({ ...response.data, movies: moviesWithDetails });
                setNewListName(response.data.name);
            } catch (error) {
                console.error('Error fetching list:', error);
            }
        };

        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const profileResponse = await axios.get('http://localhost:5000/api/user/profile', {
                        headers: { 'x-auth-token': token }
                    });
                    setIsLoggedIn(true);
                    setCurrentUser(profileResponse.data);
                    const watchedResponse = await axios.get(`http://localhost:5000/api/user/watched-movies/${profileResponse.data.username}`, {
                        headers: { 'x-auth-token': token }
                    });
                    setCurrentUserWatchedMovies(watchedResponse.data);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Error fetching current user watched movies:', error);
            }
        };

        fetchList();
        fetchCurrentUser();
    }, [username, listName]);

    const sortMovies = (movies, type, asc) => {
        const sortedMovies = [...movies];
        sortedMovies.sort((a, b) => {
            let valueA, valueB;
            switch (type) {
                case 'release_date':
                    valueA = a.release_date ? new Date(a.release_date) : new Date();
                    valueB = b.release_date ? new Date(b.release_date) : new Date();
                    break;
                case 'rating':
                    valueA = a.vote_average !== undefined ? a.vote_average : 0;
                    valueB = b.vote_average !== undefined ? b.vote_average : 0;
                    break;
                case 'runtime':
                    valueA = a.runtime !== undefined ? a.runtime : 0;
                    valueB = b.runtime !== undefined ? b.runtime : 0;
                    break;
                case 'random':
                    return 0.5 - Math.random();
                default:
                    return 0;
            }
            return asc ? valueA - valueB : valueB - valueA;
        });
        return sortedMovies;
    };

    const handleRenameList = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/user/rename-list`, { listId: list._id, newName: newListName }, {
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
            await axios.delete(`http://localhost:5000/api/user/delete-list/${list._id}`, {
                headers: { 'x-auth-token': token }
            });
            navigate(`/profile/${username}/films/lists`);
        } catch (error) {
            console.error('Error deleting list:', error);
        }
    };

    const handleRemoveMovie = async (movieId) => {
        try {
            const token = localStorage.getItem('token');
            const updatedMovies = list.movies.filter(movie => movie.id !== movieId);
            await axios.post(`http://localhost:5000/api/user/remove-movie-from-list`, { listId: list._id, movieId }, {
                headers: { 'x-auth-token': token }
            });
            setList({ ...list, movies: updatedMovies });
        } catch (error) {
            console.error('Error removing movie from list:', error);
        }
    };

    if (!list) return <div>Loading...</div>;

    const watchedMovieIds = currentUserWatchedMovies.map(movie => movie.id);
    const watchedCount = list.movies.filter(movie => watchedMovieIds.includes(movie.id)).length;
    const totalMovies = list.movies.length;
    const progressPercentage = totalMovies ? (watchedCount / totalMovies) * 100 : 0;

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
                <p>You have watched {watchedCount} out of {totalMovies} films</p>
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
                        <option value="runtime">Film Length</option>
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
                {sortMovies(list.movies, sortType, ascending).map((movie) => (
                    <div key={movie.id} className="list-details-item">
                        {editMode && (
                            <button className="remove-movie-button" onClick={() => handleRemoveMovie(movie.id)}>x</button>
                        )}
                        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="list-details-poster" onClick={() => !editMode && navigate(`/movies/${movie.id}`)} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListDetails;
