import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { FaRegUserCircle } from "react-icons/fa";
import { useAuth } from '../context/authprovider';
import SearchDialog from './SearchDialog'; // Import the new SearchDialog component

function Navbar() {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

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
                    {dropdownOpen && (
                        <div className="dropdown-menu" onMouseLeave={toggleDropdown}>
                            <Link to="/profile" className="dropdown-item">Profile</Link>
                            <button className="dropdown-item" onClick={() => alert('Change Theme')}>Theme</button>
                            <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                    {user ? (
                        <div className="user-info">
                            <div className='logged-in' onMouseEnter={toggleDropdown}>
                                <FaRegUserCircle size={30} color="white"/>
                                <span className="username">{user.username}</span>
                            </div>
                        </div>
                    ) : (
                        <span className='login-text'><Link to="/login">Login</Link></span>
                    )}
                </div>
            </div>
            <SearchDialog open={dialogOpen} onClose={closeDialog} />
        </nav>
    );
}

export default Navbar;
