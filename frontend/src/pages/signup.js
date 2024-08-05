import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './signup.css';
import { Link } from 'react-router-dom';

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(''); // Error state to display messages
    const navigate = useNavigate();

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Invalid email format');
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Signup successful:', data);
                navigate('/login'); // Replace with your desired route
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch (error) {
            setError('Server error. Please try again later.');
            console.error('Signup error:', error);
        }
    };

    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="container">
            <div className="signup-box">
                <div className="sign-up-text">Sign-up</div>
                {error && <div className="error-text">{error}</div>}
                <div className="username1">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="email">
                    <input
                        type="text"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="password">
                    <input
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                        <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
                    </span>
                </div>
                <div className="password">
                    <input
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                        <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
                    </span>
                </div>
                <div className='sign-in-button'>
                    <button onClick={handleSignup}>Sign up</button>
                </div>
                <div className='register-here-1'>Already have an account? <Link to="/login"><span className='register-text'>Login!</span></Link></div>
            </div>
        </div>
    );
}

export default Signup;
