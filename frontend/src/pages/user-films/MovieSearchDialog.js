import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
import axios from 'axios';
import debounce from 'lodash/debounce';

function MovieSearchDialog({ open, onClose }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

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
        }
    }, [searchQuery]);

    const handleSelectMovie = (movie) => {
        onClose({
            movieId: movie.id,
            title: movie.title,
            poster_path: movie.poster_path
        });
    };

    return (
        <Dialog open={open} onClose={() => onClose(null)}>
            <DialogTitle>Search Movie</DialogTitle>
            <DialogContent>
                <TextField
                    label="Search Movie"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <div className="search-results">
                    {searchResults.map(movie => (
                        <MenuItem key={movie.id} onClick={() => handleSelectMovie(movie)}>
                            <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title} style={{ marginRight: '10px' }} />
                            {movie.title}
                        </MenuItem>
                    ))}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(null)}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

export default MovieSearchDialog;
