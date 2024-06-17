import React, { useState } from 'react';
import axios from 'axios';
import './bio-avatar.css';

const UploadAvatarDialog = ({ isOpen, onClose, setUser }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            alert("Please select a file to upload.");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        const formData = new FormData();
        formData.append('avatar', selectedFile);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-auth-token': token
            }
        };

        try {
            const response = await axios.post('http://localhost:5000/api/user/avatar', formData, config);
            setUser(response.data);
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error uploading avatar', error);
        }
    };

    const handleRemoveAvatar = async () => {
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
            const response = await axios.post('http://localhost:5000/api/user/remove-avatar', {}, config);
            setUser(response.data);
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error removing avatar', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="dialog-overlay2">
            <div className="dialog-content2">
                <button className="close-button2" onClick={onClose}>✖️</button>
                <form onSubmit={handleSubmit}>
                    <input type="file" onChange={handleFileChange} className="file-input" />
                    <button type="submit" className="submit-button">Upload Avatar</button>
                </form>
                <button onClick={handleRemoveAvatar} className="remove-button">Remove Avatar</button>
            </div>
        </div>
    );
};

export default UploadAvatarDialog;
