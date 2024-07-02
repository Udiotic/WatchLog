import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './searchresults.css'; // Import CSS for styling

const SearchResults = () => {
    const { query } = useParams();
    const [results, setResults] = useState({ films: [], shows: [], books: [], games: [], music: [] });

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/search?query=${query}`);
                setResults(response.data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        };

        fetchSearchResults();
    }, [query]);

    return (
        <div className="search-results">
            <h2>Search Results for "{query}"</h2>
            <div className="category">
                <h3>Films</h3>
                {results.films.map(film => (
                    <div key={film.id}>{film.title}</div>
                ))}
            </div>
            <div className="category">
                <h3>Shows</h3>
                {results.shows.map(show => (
                    <div key={show.id}>{show.name}</div>
                ))}
            </div>
            <div className="category">
                <h3>Books</h3>
                {results.books.map(book => (
                    <div key={book.id}>{book.volumeInfo.title}</div>
                ))}
            </div>
            <div className="category">
                <h3>Games</h3>
                {results.games.map(game => (
                    <div key={game.id}>{game.name}</div>
                ))}
            </div>
            <div className="category">
                <h3>Music</h3>
                {results.music.map(album => (
                    <div key={album.id}>{album.name}</div>
                ))}
            </div>
        </div>
    );
};

export default SearchResults;
