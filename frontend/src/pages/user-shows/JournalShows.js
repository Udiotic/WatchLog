import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './journalShows.css';
import EditJournalEntryDialog from './EditJournalEntryDialog'; // Import the dialog for editing

const JournalShows = () => {
    const { username } = useParams();
    const [journalEntries, setJournalEntries] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchJournalEntries = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/user/journal-entries-shows/${username}`);
                setJournalEntries(response.data);
            } catch (error) {
                console.error('Error fetching journal entries:', error);
            }
        };

        const fetchCurrentUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const profileResponse = await axios.get('http://localhost:5001/api/user/profile', {
                        headers: { 'x-auth-token': token }
                    });
                    setCurrentUser(profileResponse.data);
                } catch (error) {
                    console.error('Error fetching current user:', error);
                }
            }
        };

        fetchJournalEntries();
        fetchCurrentUser();
    }, [username]);

    const handleDelete = async (entryId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            await axios.delete(`http://localhost:5001/api/user/delete-journal-entry-shows/${entryId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            });
            setJournalEntries(journalEntries.filter(entry => entry._id !== entryId));
        } catch (error) {
            console.error('Error deleting journal entry:', error);
        }
    };

    const handleEdit = (entry) => {
        setSelectedEntry(entry);
    };

    const handleEditClose = (updatedEntry) => {
        if (updatedEntry) {
            setJournalEntries(journalEntries.map(entry => entry._id === updatedEntry._id ? updatedEntry : entry));
        }
        setSelectedEntry(null);
    };

    const getPosterUrl = (posterPath) => {
        return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : 'default-image-url';
    };

    return (
        <div className="journal-entries-shows">
            {journalEntries.map((entry, index) => (
                <div key={index} className="journal-entry-show">
                    <img src={getPosterUrl(entry.poster_path)} alt={entry.title} className="entry-poster-show" />
                    <div className="entry-details-show">
                        <h3>{entry.title}</h3>
                        <p>Date Watched: {new Date(entry.date).toLocaleDateString()}</p>
                        {entry.rating && <p>Rating: {entry.rating} stars</p>}
                        {entry.review && <p>Review: {entry.review}</p>}
                        {currentUser && currentUser.username === username && (
                            <div className="entry-actions-show">
                                <button onClick={() => handleEdit(entry)}>Edit</button>
                                <button onClick={() => handleDelete(entry._id)}>Delete</button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
            {selectedEntry && (
                <EditJournalEntryDialog
                    open={!!selectedEntry}
                    onClose={handleEditClose}
                    entry={selectedEntry}
                />
            )}
        </div>
    );
};

export default JournalShows;
