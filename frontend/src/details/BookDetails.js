import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getBookDetails } from '../api/googlebooksApi';
import './Details.css';
import Navbar from "../components/Navbar"


const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);

    useEffect(() => {
        const fetchBookDetails = async () => {
            const details = await getBookDetails(id);
            setBook(details);
        };
        fetchBookDetails();
    }, [id]);

    const toggleItem = async (listType) => {
        try {
            const log = {
                item: {
                    id: book.id,
                    title: book.volumeInfo.title,
                    poster_path: book.volumeInfo.imageLinks?.thumbnail,
                },
            };

            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
            };

            const url = listType === 'read'
                ? 'http://localhost:5001/api/user/toggle-read-books'
                : 'http://localhost:5001/api/user/toggle-readinglist-books';

            const response = await axios.post(url, log, config);
            console.log('Response:', response);
            alert(`Book ${listType} updated successfully`);
        } catch (error) {
            console.error(`Error toggling book ${listType}`, error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
            }
        }
    };

    if (!book) return <div>Loading...</div>;

    return (
        <div><Navbar/>
        <div className="details-page">
            <div className="content">
                <div className="details-header">
                    <h1>{book.volumeInfo.title}</h1>
                    <span className="release-year">{book.volumeInfo.publishedDate.substring(0, 4)}</span>
                </div>
                <div className="details-body">
                    <div className="summary">{book.volumeInfo.description}</div>
                </div>
            </div>
            <div className="poster-container">
                <img src={book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title} className="poster-image" />
            </div>
            <div className="options">
                <button onClick={() => toggleItem('read')}>Read</button>
                <button onClick={() => toggleItem('readinglist')}>Add to Reading List</button>
            </div>
        </div>
        </div>
    );
};

export default BookDetails;
