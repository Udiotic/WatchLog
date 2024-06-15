import React, { useState } from 'react';
import axios from 'axios';
import './bio-avatar.css';

const EditBioDialog = ({ isOpen, onClose, bio, setUser }) => {
    const [newBio, setNewBio] = useState(bio || '');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            }
        };

        try {
            const response = await axios.post('http://localhost:5000/api/user/bio', { bio: newBio }, config);
            setUser(response.data);
            onClose();
        } catch (error) {
            console.error('Error updating bio', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="dialog-overlay2">
            <div className="dialog-content2">
                <button className="close-button" onClick={onClose}>✖️</button>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={newBio}
                        onChange={(e) => setNewBio(e.target.value)}
                        placeholder="Write your bio here..."
                        className="bio-textarea"
                    />
                    <button type="submit" className="submit-button">Update Bio</button>
                </form>
            </div>
        </div>
    );
};

export default EditBioDialog;
