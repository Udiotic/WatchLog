import React, { useState,useEffect } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authprovider';
import SearchDialog from './SearchDialog';
import defaultAvatar from '../images/default-avatar-nav.png';
import axios from 'axios';


function Navbar() {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [fullUser, setFullUser] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/user/profile/${user.username}`);
                    setFullUser(response.data);
                } catch (error) {
                    console.error('Error fetching user profile', error);
                }
            }
        };

        fetchUserProfile();
    }, [user]);


    const handleLogout = () => {
        logout();
        window.location.href = '/landing';
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
    };

    const avatarUrl = fullUser && fullUser.pfp ? `data:image/png;base64,${fullUser.pfp}` : defaultAvatar;

    return (
        <nav>
            <div className="nav-bar">
                <span className="logo navLogo">
                    <Link to="/landing">Watchlog</Link>
                </span>
                <div className="menu">
                    <ul className="nav-links">
                        <li>
                            <Link to="/films">FILMS</Link>
                        </li>
                        <li>
                            <Link to="/shows">SHOWS</Link>
                        </li>
                        <li>
                            <Link to="/books">BOOKS</Link>
                        </li>
                        <li>
                            <Link to="/music">MUSIC</Link>
                        </li>
                        <li>
                            <Link to="/games">GAMES</Link>
                        </li>
                    </ul>
                </div>
                <div className="logButton">
                    <button className="log-button" onClick={openDialog}>Search</button>
                </div>
                <div className="userprofile">
                    {dropdownOpen && user && (
                        <div className="dropdown-menu" onMouseLeave={toggleDropdown}>
                            <Link to={`/profile/${user.username}`} className="dropdown-item">Profile</Link>
                            <button className="dropdown-item" onClick={() => alert('Change Theme')}>Theme</button>
                            <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                    {user ? (
                        <div className="user-info">
                            <div className='logged-in' onMouseEnter={toggleDropdown}>
                                <img src={avatarUrl} alt="User Avatar" className="avatar-icon" />
                                <span className="username">{user.username}</span>
                            </div>
                        </div>
                    ) : (
                        <button className='login-button'><Link to="/login">Sign In</Link></button>
                    )}
                </div>
            </div>
            <SearchDialog open={dialogOpen} onClose={closeDialog} />
        </nav>
    );
}

export default Navbar;
