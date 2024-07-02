import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import CreateListDialog from '../../components/CreateListDialog'; // Import the dialog
import './lists.css'; // Import CSS for styling

const Lists = () => {
    const { username } = useParams();
    const [lists, setLists] = useState([]);
    const [createListDialogOpen, setCreateListDialogOpen] = useState(false);
    const loggedInUsername = localStorage.getItem('username'); // Get the logged-in username

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/user/movie-lists/${username}`);
                setLists(response.data);
            } catch (error) {
                console.error('Error fetching lists:', error);
            }
        };

        fetchLists();
    }, [username]);

    const handleCreateListDialogClose = (updatedLists) => {
        setCreateListDialogOpen(false);
        if (updatedLists) {
            setLists(updatedLists);
        }
    };

    return (
        <div className="lists-page">
            <div className="header">
                {loggedInUsername === username && (
                    <button className="create-list-button" onClick={() => setCreateListDialogOpen(true)}>
                        Create List
                    </button>
                )}
            </div>
            <div className="lists-container">
                {lists.map((list) => (
                    <div key={list._id} className="list-item">
                        <Link to={`/profile/${username}/films/lists/${list.name}`}>
                            <h3>{list.name}</h3>
                            <div className="list-preview">
                                {list.movies.slice(0, 4).map((movie) => (
                                    <img key={movie.id} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="list-movie-poster" />
                                ))}
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            {createListDialogOpen && (
                <CreateListDialog
                    open={createListDialogOpen}
                    onClose={handleCreateListDialogClose}
                />
            )}
        </div>
    );
};

export default Lists;
