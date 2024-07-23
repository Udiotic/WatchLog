import React, { useState, useCallback, useEffect } from 'react';
import './SearchDialog.css';
import { debounce } from 'lodash';
import { searchMovies, searchTVShows } from '../api/tmdbApi';
import { searchGames } from '../api/rawgApi';
import { searchBooks } from '../api/googlebooksApi';
import { searchMusic } from '../api/lastfmApi';
import AddMovieDialog from './AddMovieDialog'; // Import AddMovieDialog

function SearchDialog({ open, onClose, limit = 10 }) {
    const [category, setCategory] = useState('');
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [showAddDialog, setShowAddDialog] = useState(false);

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setQuery('');
        setResults([]);
    };

    // Debounced search function
    const debouncedSearch = useCallback(debounce(async (searchQuery) => {
        if (searchQuery.length > 1) {
            let results = [];
            switch (category) {
                case 'movies':
                    results = await searchMovies(searchQuery, limit);
                    break;
                case 'tvshows':
                    results = await searchTVShows(searchQuery, limit);
                    break;
                case 'games':
                    results = await searchGames(searchQuery, limit);
                    break;
                case 'books':
                    results = await searchBooks(searchQuery, limit);
                    break;
                case 'music':
                    results = await searchMusic(searchQuery, limit);
                    break;
                default:
                    break;
            }
            setResults(results);
        } else {
            setResults([]);
        }
    }, 300), [category, limit]); // 300ms debounce delay

    const handleSearch = (e) => {
        const searchQuery = e.target.value;
        setQuery(searchQuery);
        debouncedSearch(searchQuery);
    };

    useEffect(() => {
        if (!open) {
            setCategory('');
            setQuery('');
            setResults([]);
            setSelectedMovie(null);
        }
    }, [open]);

    if (!open && !showAddDialog) return null;

    const handleResultClick = (result) => {
        setSelectedMovie(result);
        setShowAddDialog(true);
    };

    const handleAddMovieDialogClose = () => {
        setSelectedMovie(null);
        setShowAddDialog(false);
    };

    return (
        <>
            {open && !showAddDialog && (
                <div className="favourites-search-dialog-overlay">
                    <div className="favourites-search-dialog-content">
                        What do you wanna add?
                        <button className="favourites-search-close-button" onClick={onClose}>X</button>
                        <div className="dialog-body">
                            <select value={category} onChange={handleCategoryChange} className='sel-category'>
                                <option value="" disabled>Select category</option>
                                <option value="movies">Movies</option>
                                <option value="tvshows">TV Shows</option>
                                <option value="games">Games</option>
                                <option value="books">Books</option>
                                <option value="music">Music</option>
                            </select>
                            {category && (
                                <div className="search-field">
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={handleSearch}
                                        placeholder={`Search for ${category}...`}
                                    />
                                    {results.length > 0 && (
                                        <ul className="search-results">
                                            {results.map((result) => (
                                                <li key={result.id}>
                                                    <div onClick={() => handleResultClick(result)}>
                                                        {result.poster_path || result.background_image || (result.volumeInfo && result.volumeInfo.imageLinks && result.volumeInfo.imageLinks.thumbnail) || result.image ? (
                                                            <img src={result.poster_path || result.background_image || (result.volumeInfo && result.volumeInfo.imageLinks && result.volumeInfo.imageLinks.thumbnail) || result.image} alt={result.title || result.name || result.volumeInfo.title || result.artist} />
                                                        ) : null}
                                                        <span className="result-title">{result.title || result.name || result.volumeInfo.title || result.artist}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {showAddDialog && selectedMovie && (
                <AddMovieDialog
                    open={showAddDialog}
                    onClose={handleAddMovieDialogClose}
                    movie={selectedMovie}
                />
            )}
        </>
    );
}

export default SearchDialog;
