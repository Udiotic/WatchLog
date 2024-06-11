import React, { useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { FaRegUserCircle } from "react-icons/fa";
import { useAuth } from '../context/authprovider'; // Import useAuth hook

function Navbar() {
    const { user, logout } = useAuth(); // Get user and logout function from the context
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        // Redirect to login page or home page after logout
        window.location.href = '/landing';
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
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
                            <Link to="/movies">Movies</Link>
                        </li>
                        <li>
                            <Link to="/shows">Shows</Link>
                        </li>
                        <li>
                            <Link to="/books">Books</Link>
                        </li>
                        <li>
                            <Link to="/music">Music</Link>
                        </li>
                        <li>
                            <Link to="/games">Games</Link>
                        </li>
                    </ul>
                </div>
                <div className="searchBox">
                    <div className="search-field">
                        <input type="text" placeholder="Search..." />
                    </div>
                </div>
                <div className="userprofile" onMouseLeave={toggleDropdown}>
                    {dropdownOpen && (
                      <div className="dropdown-menu">
                            <Link to="/profile" className="dropdown-item">Profile</Link>
                            <button className="dropdown-item" onClick={() => alert('Change Theme')}>Theme</button>
                            <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                    {user ? (

                      <div className="user-info" onMouseEnter={toggleDropdown} >
                          <FaRegUserCircle size={30} />
                            <span className="username">{user.username}</span>
                        </div>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
