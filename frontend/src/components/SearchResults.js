import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { searchMovies, searchTVShows } from '../api/tmdbApi';
import { searchBooks } from '../api/googlebooksApi';
import { searchGames } from '../api/rawgApi';
import { searchMusic } from '../api/lastfmApi';
import './searchresults.css';

const SearchResults = () => {
    const { category, query } = useParams();
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResults = async () => {
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
            setResults(results);
        };

        fetchResults();
    }, [category, query]);

    const handleResultClick = (id) => {
        navigate(`/${category}/${id}`);
    };

    return (
        <div className="search-results-page">
            <h2>Search Results for "{query}" in {category}</h2>
            <div className="results-container">
                {results.map(result => (
                    <div key={result.id} className="result-card" onClick={() => handleResultClick(result.id)}>
                        {result.poster_path || result.background_image || (result.volumeInfo && result.volumeInfo.imageLinks && result.volumeInfo.imageLinks.thumbnail) || result.image ? (
                            <img src={result.poster_path || result.background_image || (result.volumeInfo && result.volumeInfo.imageLinks && result.volumeInfo.imageLinks.thumbnail) || result.image} alt={result.title || result.name || result.volumeInfo.title || result.artist} />
                        ) : null}
                        <span className="result-title">{result.title || result.name || result.volumeInfo.title || result.artist}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchResults;
