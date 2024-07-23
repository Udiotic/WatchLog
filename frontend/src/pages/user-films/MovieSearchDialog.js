import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, TextField, MenuItem } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';
import debounce from 'lodash/debounce';
import './MovieSearchDialog.css';

function MovieSearchDialog({ open, onClose }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const searchInputRef = useRef(null);
    const dropdownRef = useRef(null);

    const handleSearch = async (query) => {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${query}&api_key=a26cfd760b8de60d041bdc062f4ff9a7`);
            setSearchResults(response.data.results.slice(0, 10));
        } catch (error) {
            console.error('Error searching movies:', error);
        }
    };

    const debouncedSearch = debounce(handleSearch, 300);

    useEffect(() => {
        if (searchQuery) {
            debouncedSearch(searchQuery);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery, debouncedSearch]);

    const handleSelectMovie = (movie) => {
        onClose({
            movieId: movie.id,
            title: movie.title,
            poster_path: movie.poster_path
        });
    };

    const handleCancel = () => {
        onClose(null);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !searchInputRef.current.contains(event.target)) {
                setSearchResults([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <Dialog open={open} onClose={handleCancel} maxWidth="xs" fullWidth>
            <DialogTitle>
                Search Movie
            </DialogTitle>
            <DialogContent>
                <TextField
                    label="Search Movie"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    inputRef={searchInputRef}
                />
                <div className="search-results-container">
                    {searchResults.length > 0 && (
                        <ul className="favourite-search-dropdown" ref={dropdownRef}>
                            {searchResults.map(movie => (
                                <li key={movie.id} onClick={() => handleSelectMovie(movie)} className="search-result-item">
                                    <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title} className="search-result-img" />
                                    <span className="search-result-title">{movie.title}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default MovieSearchDialog;
