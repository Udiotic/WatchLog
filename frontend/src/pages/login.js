import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../context/authprovider.js';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import './login.css';
import './landing.js';
import { Link } from 'react-router-dom';
// import Navbar from '../components/Navbar'
function Login() {
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleLogin = async () => {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            // Handle successful login (e.g., save token, redirect)
            console.log('Login successful:', data);
            login(data.token); // Use the login function from useAuth
            navigate('/landing'); // Replace with your desired route
        } else {
            // Handle login errors
            console.error('Login failed:', data.message);
        }
    };
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="container">
            {/* <Navbar/> */}
            <div className="login-box">
                <div className="sign-in-text">
                    Sign-in
                </div>
                <div className="email">
                    <input type="text" 
                    placeholder="Enter username or email"  
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
                        <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash}/>
                    </span>
                </div>
                <div className='forgot-password'>
                    <span className='forgot-password-text'>Forgot Password?</span>
                </div>
                <div className='sign-in-button'>
                    <button onClick={handleLogin} >Sign in</button>
                </div>
                <div className='register-here'>Don't have an account? <span className='register-text'> <Link to  = "/signup">Register!</Link></span></div>
            </div>
        </div>
    );
}

export default Login;
