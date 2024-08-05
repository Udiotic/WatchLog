import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import CreateListDialog from '../../components/CreateListDialog'; // Import the dialog
import './listshows.css'; // Import CSS for styling

const ListsShows = () => {
    const { username } = useParams();
    const [lists, setLists] = useState([]);
    const [createListDialogOpen, setCreateListDialogOpen] = useState(false);
    const loggedInUsername = localStorage.getItem('username'); // Get the logged-in username

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/user/show-lists/${username}`);
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
        <div className="lists-page-shows">
            <div className="header-shows">
                {loggedInUsername === username && (
                    <button className="create-list-button-shows" onClick={() => setCreateListDialogOpen(true)}>
                        Create a List
                    </button>
                )}
            </div>
            <div className="lists-container-shows">
                {lists.map((list) => (
                    <div key={list._id} className="list-item-shows">
                        <Link to={`/profile/${username}/shows/lists/${list.name}`}>
                            <h3>{list.name}</h3>
                            <div className="list-preview-shows">
                                {list.shows.slice(0, 4).map((show) => (
                                    <img key={show.id} src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} alt={show.title} className="list-show-poster" />
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

export default ListsShows;
