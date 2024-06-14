import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';  // Adjust the path as necessary
import EditBioDialog from '../components/EditBioDialog'; // Import the new EditBioDialog component
import UploadAvatarDialog from '../components/UploadAvatarDialog'; // Import the new UploadAvatarDialog component
import './profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditBioOpen, setIsEditBioOpen] = useState(false);
    const [isUploadAvatarOpen, setIsUploadAvatarOpen] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            };

            try {
                const response = await axios.get('http://localhost:5000/api/user/profile', config);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user profile', error);
            }
        };
        fetchUserProfile();
    }, []);

    const handleEditBioClick = () => {
        setIsEditBioOpen(true);
    };

    const handleAvatarClick = () => {
        setIsUploadAvatarOpen(true);
    };

    if (!user) return <div className="loading">Loading...</div>;

    const getPosterUrl = (posterPath) => {
        return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : 'default-image-url';
    };

    return (
        <div>
            <Navbar />
            <div className="profile-page">
                <div className="profile-header">
                    <img src={user.pfp || 'default-avatar.png'} alt="User Avatar" className="avatar" onClick={handleAvatarClick} />
                    <div className="profile-info">
                        <h1>{user.username}</h1>
                        <div className="bio-container">
                            <p className="bio">{user.bio || "This user hasn't written a bio yet."}</p>
                            <button className="edit-bio-button" onClick={handleEditBioClick}>✏️</button>
                        </div>
                    </div>
                </div>
                <div className="profile-content">
                    <h2>Favorites</h2>
                    <ul className="favorites-list">
                        {user.favorites && user.favorites.map(fav => (
                            <li key={fav.id}>
                                <Link to={`/movies/${fav.id}`}>
                                    <img src={getPosterUrl(fav.poster_path)} alt={fav.title} />
                                    <span>{fav.title}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <h2>Watched Movies</h2>
                    <ul className="category-list">
                        {user.watchedMovies && user.watchedMovies.map(movie => (
                            <li key={movie.id}>
                                <Link to={`/movies/${movie.id}`}>
                                    <img src={getPosterUrl(movie.poster_path)} alt={movie.title} />
                                    <span>{movie.title}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <h2>Movie Watchlist</h2>
                    <ul className="category-list">
                        {user.watchlistMovies && user.watchlistMovies.map(movie => (
                            <li key={movie.id}>
                                <Link to={`/movies/${movie.id}`}>
                                    <img src={getPosterUrl(movie.poster_path)} alt={movie.title} />
                                    <span>{movie.title}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <h2>Watched TV Shows</h2>
                    <ul className="category-list">
                        {user.watchedTVShows && user.watchedTVShows.map(show => (
                            <li key={show.id}>
                                <Link to={`/tvshows/${show.id}`}>
                                    <img src={getPosterUrl(show.poster_path)} alt={show.name} />
                                    <span>{show.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <h2>TV Show Watchlist</h2>
                    <ul className="category-list">
                        {user.watchlistTVShows && user.watchlistTVShows.map(show => (
                            <li key={show.id}>
                                <Link to={`/tvshows/${show.id}`}>
                                    <img src={getPosterUrl(show.poster_path)} alt={show.name} />
                                    <span>{show.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <h2>Read Books</h2>
                    <ul className="category-list">
                        {user.readBooks && user.readBooks.map(book => (
                            <li key={book.id}>
                                <Link to={`/books/${book.id}`}>
                                    <img src={book.poster_path || 'default-image-url'} alt={book.title} />
                                    <span>{book.title}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <h2>Reading List</h2>
                    <ul className="category-list">
                        {user.readingList && user.readingList.map(book => (
                            <li key={book.id}>
                                <Link to={`/books/${book.id}`}>
                                    <img src={book.poster_path || 'default-image-url'} alt={book.title} />
                                    <span>{book.title}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <h2>Played Games</h2>
                    <ul className="category-list">
                        {user.playedGames && user.playedGames.map(game => (
                            <li key={game.id}>
                                <Link to={`/games/${game.id}`}>
                                    <img src={game.poster_path || 'default-image-url'} alt={game.name} />
                                    <span>{game.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <h2>Game List</h2>
                    <ul className="category-list">
                        {user.gameList && user.gameList.map(game => (
                            <li key={game.id}>
                                <Link to={`/games/${game.id}`}>
                                    <img src={game.poster_path || 'default-image-url'} alt={game.name} />
                                    <span>{game.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <h2>Listened Music</h2>
                    <ul className="category-list">
                        {user.listenedMusic && user.listenedMusic.map(album => (
                            <li key={album.id}>
                                <Link to={`/music/${album.id}`}>
                                    <img src={album.poster_path || 'default-image-url'} alt={album.name} />
                                    <span>{album.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <h2>Playlist</h2>
                    <ul className="category-list">
                        {user.playlist && user.playlist.map(album => (
                            <li key={album.id}>
                                <Link to={`/music/${album.id}`}>
                                    <img src={album.poster_path || 'default-image-url'} alt={album.name} />
                                    <span>{album.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <EditBioDialog
                isOpen={isEditBioOpen}
                onClose={() => setIsEditBioOpen(false)}
                bio={user.bio}
                setUser={setUser}
            />
            <UploadAvatarDialog
                isOpen={isUploadAvatarOpen}
                onClose={() => setIsUploadAvatarOpen(false)}
                setUser={setUser}
            />
        </div>
    );
};

export default Profile;
