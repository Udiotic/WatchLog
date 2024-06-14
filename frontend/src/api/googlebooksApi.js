import axios from 'axios';

const API_URL = 'https://www.googleapis.com/books/v1/volumes';
const API_KEY = 'AIzaSyDWDCD15u4yxe40PxUCzWtNhvDIiUGsaT4'; // Replace with your Google Books API key

export const searchBooks = async (query, limit = 10) => {
    try {
        const response = await axios.get(API_URL, {
            params: {
                q: query,
                maxResults: 10,
                orderBy: 'relevance',
                key: API_KEY,
            }
        });
        return response.data.items.slice(0, limit).map(book => ({
            id: book.id,
            volumeInfo: {
                title: book.volumeInfo.title,
                imageLinks: book.volumeInfo.imageLinks,
                publishedDate: book.volumeInfo.publishedDate,
            },
        }));
    } catch (error) {
        console.error('Error fetching books:', error);
        return [];
    }
};
export const getBookDetails = async (bookId) => {
    try {
        const response = await axios.get(`${API_URL}/${bookId}`, {
            params: {
                key: API_KEY,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching book details:', error);
        return null;
    }
};

