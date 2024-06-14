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
        } catch (error) {
            console.error('Error uploading avatar', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="dialog-overlay">
            <div className="dialog-content">
                <button className="close-button" onClick={onClose}>✖️</button>
                <form onSubmit={handleSubmit}>
                    <input type="file" onChange={handleFileChange} className="file-input" />
                    <button type="submit" className="submit-button">Upload Avatar</button>
                </form>
            </div>
        </div>
    );
};

export default UploadAvatarDialog;
