import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
    const [message, setMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const token = query.get('token');

        const verifyEmail = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/auth/verify-email?token=${token}`);
                setMessage(response.data.message);
                setTimeout(() => {
                    navigate('/login'); // Redirect to login after successful verification
                }, 3000);
            } catch (error) {
                setMessage('Verification failed. Please try again.');
            }
        };

        if (token) {
            verifyEmail();
        } else {
            setMessage('Invalid verification link.');
        }
    }, [location, navigate]);

    return (
        <div>
            <h1>Email Verification</h1>
            <p>{message}</p>
        </div>
    );
};

export default VerifyEmail;
