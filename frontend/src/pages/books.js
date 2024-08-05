import React, { useRef } from 'react';
import './media.css';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { getTrendingBooks, getPopularBooks } from '../api/googlebooksApi';
import useCachedAPI from '../hooks/useCachedAPI'; // Custom hook

function Books() {
    const trendingBooksRef = useRef(null);
    const popularBooksRef = useRef(null);
    const navigate = useNavigate();

    // Use the caching hook to fetch and cache data
    const { data: trendingBooks, loading: loadingTrending, error: errorTrending } = useCachedAPI('trendingBooks', async () => {
        // Call the API function for trending books
        const books = await getTrendingBooks();
        return books;
    });

    const { data: popularBooks, loading: loadingPopular, error: errorPopular } = useCachedAPI('popularBooks', async () => {
        // Call the API function for popular books
        const books = await getPopularBooks();
        return books;
    });

    const scroll = (direction, ref) => {
        const scrollAmount = 800;
        if (direction === 'left') {
            ref.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleBookClick = (id) => {
        navigate(`/books/${id}`);
    };

    return (
        <div className='media-page'>
            <Navbar />
            <div className="media-section">
                <span>Trending This Week</span>
                {loadingTrending ? (
                    <div>Loading...</div>
                ) : errorTrending ? (
                    <div>Error loading trending books.</div>
                ) : (
                    <div className="media-wrapper">
                        <button className="scroll-button left" onClick={() => scroll('left', trendingBooksRef)}>‹</button>
                        <div className="media-container" ref={trendingBooksRef}>
                            {trendingBooks.map(book => (
                                <div key={book.id} className="media-card" onClick={() => handleBookClick(book.id)}>
                                    <img src={book.image} alt={book.title} className="media-poster" />
                                    <div className="media-info">
                                        <h3>{book.title}</h3>
                                        <p>Published: {book.publishedDate}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="scroll-button right" onClick={() => scroll('right', trendingBooksRef)}>›</button>
                    </div>
                )}
            </div>
            <div className="media-section">
                <span>All-Time Popular</span>
                {loadingPopular ? (
                    <div>Loading...</div>
                ) : errorPopular ? (
                    <div>Error loading popular books.</div>
                ) : (
                    <div className="media-wrapper">
                        <button className="scroll-button left" onClick={() => scroll('left', popularBooksRef)}>‹</button>
                        <div className="media-container" ref={popularBooksRef}>
                            {popularBooks.map(book => (
                                <div key={book.id} className="media-card" onClick={() => handleBookClick(book.id)}>
                                    <img src={book.image} alt={book.title} className="media-poster" />
                                    <div className="media-info">
                                        <h3>{book.title}</h3>
                                        <p>Published: {book.publishedDate}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="scroll-button right" onClick={() => scroll('right', popularBooksRef)}>›</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Books;
