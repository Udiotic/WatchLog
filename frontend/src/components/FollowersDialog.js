import React from 'react';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../images/default-avatar.png';
import './FollowersDialog.css';

const FollowersDialog = ({ open, onClose, title, users }) => {
    const navigate = useNavigate();

    if (!open) return null;

    const handleUserClick = (username) => {
        onClose(); // Close the dialog
        navigate(`/profile/${username}`);
    };

    return (
        <div className="followers-dialog-overlay" onClick={onClose}>
            <div className="followers-dialog-content" onClick={e => e.stopPropagation()}>
                <h2>{title}</h2>
                <ul className="followers-list">
                    {users.map(user => (
                        <li key={user._id} className="followers-item" onClick={() => handleUserClick(user.username)}>
                            <img src={user.pfp ? `data:image/jpeg;base64,${user.pfp}` : defaultAvatar} alt="Avatar" className="avatar" />
                            <span>{user.username}</span>
                        </li>
                    ))}
                </ul>
                <button className="dialog-close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default FollowersDialog;
