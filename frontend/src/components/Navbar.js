import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authprovider';
import defaultAvatar from '../images/default-avatar-nav.png';
import { searchMovies, searchTVShows } from '../api/tmdbApi';
import { searchGames } from '../api/rawgApi';
import { searchBooks } from '../api/googlebooksApi';
import { searchMusic } from '../api/lastfmApi';
import axios from 'axios';
import SearchDialog from './SearchDialog';
import { debounce } from 'lodash';
import './Navbar.css';

function Navbar() {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [fullUser, setFullUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [category, setCategory] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname.split('/')[1];
        switch (path) {
            case 'films':
                setCategory('movies');
                break;
            case 'shows':
                setCategory('tvshows');
                break;
            case 'books':
                setCategory('books');
                break;
            case 'games':
                setCategory('games');
                break;
            case 'music':
                setCategory('music');
                break;
            default:
                setCategory('');
        }
    }, [location]);

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

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            const results = await searchByCategory(category, searchQuery.trim());
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const searchByCategory = async (category, query) => {
        let results = [];
        switch (category) {
            case 'movies':
                results = await searchMovies(query);
                break;
            case 'tvshows':
                results = await searchTVShows(query);
                break;
            case 'books':
                results = await searchBooks(query);
                break;
            case 'games':
                results = await searchGames(query);
                break;
            case 'music':
                results = await searchMusic(query);
                break;
            default:
                break;
        }
        return results.sort((a, b) => b.popularity - a.popularity);
    };

    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (query.trim()) {
                const results = await searchByCategory(category, query.trim());
                setSearchResults(results);
            } else {
                setSearchResults([]);
            }
        }, 300),
        [category]
    );

    useEffect(() => {
        debouncedSearch(searchQuery);
    }, [searchQuery, debouncedSearch]);

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
                            <Link to="/games">GAMES</Link>
                        </li>
                        <li>
                            <Link to="/music">MUSIC</Link>
                        </li>
                    </ul>
                </div>
                <div className="logButton">
                    <button className="log-button" onClick={openDialog}><span className='plus'>+</span>ADD</button>
                </div>
                <form className="search-form" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder={category ? `Search ${category}...` : "Search..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input-navbar"
                    />
                    {searchResults.length > 0 && (
                        <ul className="search-dropdown">
                            {searchResults.map((result) => (
                                <li key={result.id} onClick={() => navigate(`/${category}/${result.id}`)}>
                                    <img src={result.poster_path || result.image || result.volumeInfo?.imageLinks?.thumbnail} alt={result.title || result.name || result.volumeInfo?.title || result.artist} />
                                    <span>{result.title || result.name || result.volumeInfo?.title || result.artist}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </form>
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
                        <button className='login-button'><Link to="/login">Sign in</Link></button>
                    )}
                </div>
            </div>
            <SearchDialog open={dialogOpen} onClose={closeDialog} />
        </nav>
    );
}

export default Navbar;
