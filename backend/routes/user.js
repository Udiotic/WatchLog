const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

// Helper function to toggle item in list
const toggleItemInList = (list, item) => {
    const index = list.findIndex(existingItem => existingItem.id === item.id);
    if (index === -1) {
        list.push(item);
    } else {
        list.splice(index, 1);
    }
};

// Remove item from list
const removeItemFromList = (list, item) => {
    const index = list.findIndex(existingItem => existingItem.id === item.id);
    if (index !== -1) {
        list.splice(index, 1);
    }
};

// Toggle watched item for movies
router.post('/toggle-watched-movies', auth, async (req, res) => {
    const { item } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        toggleItemInList(user.watchedMovies, item);
        await user.save();
        res.status(200).json(user.watchedMovies);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle watchlist item for movies
router.post('/toggle-watchlist-movies', auth, async (req, res) => {
    const { item } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        toggleItemInList(user.watchlistMovies, item);
        await user.save();
        res.status(200).json(user.watchlistMovies);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle watched item for TV shows
router.post('/toggle-watched-tvshows', auth, async (req, res) => {
    const { item } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        toggleItemInList(user.watchedTVShows, item);
        removeItemFromList(user.watchlistTVShows, item);
        await user.save();
        res.status(200).json(user.watchedTVShows);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle watchlist item for TV shows
router.post('/toggle-watchlist-tvshows', auth, async (req, res) => {
    const { item } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        toggleItemInList(user.watchlistTVShows, item);
        await user.save();
        res.status(200).json(user.watchlistTVShows);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle read item for books
router.post('/toggle-read-books', auth, async (req, res) => {
    const { item } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        toggleItemInList(user.readBooks, item);
        removeItemFromList(user.readinglistBooks, item);
        await user.save();
        res.status(200).json(user.readBooks);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle reading list item for books
router.post('/toggle-readinglist-books', auth, async (req, res) => {
    const { item } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        toggleItemInList(user.readinglistBooks, item);
        await user.save();
        res.status(200).json(user.readinglistBooks);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle played item for games
router.post('/toggle-played-games', auth, async (req, res) => {
    const { item } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        toggleItemInList(user.playedGames, item);
        removeItemFromList(user.gamelistGames, item);
        await user.save();
        res.status(200).json(user.playedGames);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle game list item for games
router.post('/toggle-gamelist-games', auth, async (req, res) => {
    const { item } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        toggleItemInList(user.gamelistGames, item);
        await user.save();
        res.status(200).json(user.gamelistGames);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle listened item for music
router.post('/toggle-listened-music', auth, async (req, res) => {
    const { item } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        toggleItemInList(user.listenedMusic, item);
        removeItemFromList(user.playlistMusic, item);
        await user.save();
        res.status(200).json(user.listenedMusic);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle playlist item for music
router.post('/toggle-playlist-music', auth, async (req, res) => {
    const { item } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        toggleItemInList(user.playlistMusic, item);
        await user.save();
        res.status(200).json(user.playlistMusic);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user profile by username (publicly accessible)
router.get('/profile/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
            .select('-password')
            .populate('followers', 'username pfp')
            .populate('following', 'username pfp');

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});



// Get current user's profile (private)
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

const multer = require('multer');

// Configure multer for file uploads

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Update user bio
router.post('/bio', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.bio = req.body.bio;
        await user.save();
        res.json(user);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Convert file buffer to Base64 string
        const base64Image = req.file.buffer.toString('base64');

        user.pfp = base64Image; // Store the Base64 string in the database
        await user.save();
        res.json(user);
    } catch (error) {
        console.error('Error uploading avatar:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/remove-avatar', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.pfp = null; // Remove the avatar from the database
        await user.save();
        res.json(user);
    } catch (error) {
        console.error('Error removing avatar:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Follow a user
router.post('/follow/:id', auth, async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToFollow || !currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (currentUser.following.includes(userToFollow._id)) {
            // Unfollow
            currentUser.following.pull(userToFollow._id);
            userToFollow.followers.pull(currentUser._id);
        } else {
            // Follow
            currentUser.following.push(userToFollow._id);
            userToFollow.followers.push(currentUser._id);
        }

        await currentUser.save();
        await userToFollow.save();

        const populatedUserToFollow = await User.findById(req.params.id).populate('followers', 'username pfp');
        const populatedCurrentUser = await User.findById(req.user.id).populate('following', 'username pfp');

        res.status(200).json({
            followers: populatedUserToFollow.followers,
            following: populatedCurrentUser.following
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/watched-movies/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select('watchedMovies');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.watchedMovies);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get watchlist movies
router.get('/watchlist-movies/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select('watchlistMovies');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.watchlistMovies);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/add-watched-movie', auth, async (req, res) => {
    const { movie, rating, date, review } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const existingMovie = user.watchedMovies.find(m => m.id === movie.id);
        if (!existingMovie) {
            user.watchedMovies.push({ id: movie.id, title: movie.title, poster_path: movie.poster_path });
        }
        
        user.journalEntries.push({ movieId: movie.id, title: movie.title, poster_path: movie.poster_path, rating, date, review });
        await user.save();
        res.status(200).json(user.journalEntries);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get journal entries
router.get('/journal-entries/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select('journalEntries');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.journalEntries);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a journal entry
router.put('/update-journal-entry', auth, async (req, res) => {
    const { entryId, rating, review } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const entry = user.journalEntries.id(entryId);
        if (!entry) return res.status(404).json({ message: 'Entry not found' });

        entry.rating = rating;
        entry.review = review;
        await user.save();

        res.status(200).json(user.journalEntries);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a journal entry
router.delete('/delete-journal-entry/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const entryId = req.params.id;
        user.journalEntries = user.journalEntries.filter(entry => entry._id.toString() !== entryId);

        await user.save();
        res.status(200).json({ message: 'Journal entry deleted successfully' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a new movie list
router.post('/add-movie-list', auth, async (req, res) => {
    const { name } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const newList = { name, movies: [] };
        user.lists.push(newList);
        await user.save();
        res.status(200).json(user.lists);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a movie to a movie list
router.post('/add-movie-to-list', auth, async (req, res) => {
    const { listId, movie } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const list = user.lists.id(listId);
        if (!list) return res.status(404).json({ message: 'List not found' });

        if (!list.movies.some(m => m.id === movie.id)) {
            list.movies.push(movie);
            await user.save();
        }

        res.status(200).json(list);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/movie-lists/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select('lists');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.lists);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a movie list by its name
router.get('/movie-list/:username/:listName', async (req, res) => {
    try {
        const { username, listName } = req.params;
        const user = await User.findOne({ username }).select('lists');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const list = user.lists.find(list => list.name === listName);
        if (!list) return res.status(404).json({ message: 'List not found' });

        res.json(list);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Delete a movie list
router.delete('/delete-list/:listId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Find the list by ID and remove it
        const listIndex = user.lists.findIndex(list => list.id === req.params.listId);
        if (listIndex === -1) return res.status(404).json({ message: 'List not found' });

        user.lists.splice(listIndex, 1);
        await user.save();

        res.status(200).json({ message: 'List deleted successfully' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get favorite movies by timeframe
router.get('/favorite-movies/:username/:timeframe', async (req, res) => {
    const { username, timeframe } = req.params;
    try {
        const user = await User.findOne({ username }).select(`favoriteMovies.${timeframe}`);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.favoriteMovies[timeframe]);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a favorite movie
router.post('/favorite-movies/:timeframe', auth, async (req, res) => {
    const { movie } = req.body;
    const { timeframe } = req.params;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.favoriteMovies[timeframe]) {
            user.favoriteMovies[timeframe] = [];
        }

        if (!user.favoriteMovies[timeframe].some(m => m.movieId === movie.movieId)) {
            user.favoriteMovies[timeframe].push(movie);
            await user.save();
        }

        res.status(200).json(user.favoriteMovies[timeframe]);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove a favorite movie
router.post('/remove-favorite-movie/:timeframe', auth, async (req, res) => {
    const { movieId } = req.body;
    const { timeframe } = req.params;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.favoriteMovies[timeframe] = user.favoriteMovies[timeframe].filter(movie => movie.movieId !== movieId);
        await user.save();

        res.status(200).json(user.favoriteMovies[timeframe]);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Rename a movie list
router.post('/rename-list', auth, async (req, res) => {
    const { listId, newName } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const list = user.lists.id(listId);
        if (!list) return res.status(404).json({ message: 'List not found' });

        list.name = newName;
        await user.save();
        res.status(200).json(user.lists);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove a movie from a list
router.post('/remove-movie-from-list', auth, async (req, res) => {
    const { listId, movieId } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const list = user.lists.id(listId);
        if (!list) return res.status(404).json({ message: 'List not found' });

        list.movies = list.movies.filter(movie => movie.id !== movieId);
        await user.save();
        res.status(200).json(user.lists);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get recent activities
router.get('/recent-activities/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select('recentActivities');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.recentActivities);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Middleware to add recent activity
const addRecentActivity = async (userId, activity) => {
    const user = await User.findById(userId);
    user.recentActivities.unshift(activity); // Add to the beginning
    if (user.recentActivities.length > 20) {
        user.recentActivities.pop(); // Limit to 20 activities
    }
    await user.save();
};

// Search endpoint
router.get('/search', async (req, res) => {
    const query = req.query.query;

    try {
        const [films, shows, books, games, music] = await Promise.all([
            searchFilms(query),
            searchShows(query),
            searchBooks(query),
            searchGames(query),
            searchMusic(query),
        ]);

        res.json({ films, shows, books, games, music });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

const searchFilms = async (query) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=a26cfd760b8de60d041bdc062f4ff9a7&query=${query}`);
        return response.data.results;
    } catch (error) {
        console.error('Error searching films:', error);
        return [];
    }
};

const searchShows = async (query) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/tv?api_key=a26cfd760b8de60d041bdc062f4ff9a7&query=${query}`);
        return response.data.results;
    } catch (error) {
        console.error('Error searching shows:', error);
        return [];
    }
};

const searchBooks = async (query) => {
    try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=AIzaSyDWDCD15u4yxe40PxUCzWtNhvDIiUGsaT4`);
        return response.data.items;
    } catch (error) {
        console.error('Error searching books:', error);
        return [];
    }
};

const searchGames = async (query) => {
    try {
        const response = await axios.get(`https://api.rawg.io/api/games?key=000df7409a9e40eead9b418d091a5945&search=${query}`);
        return response.data.results;
    } catch (error) {
        console.error('Error searching games:', error);
        return [];
    }
};

const searchMusic = async (query) => {
    try {
        const response = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=album.search&album=${query}&api_key=f0f9d58822fe556416d0a868289cd971&format=json`);
        return response.data.results.albummatches.album;
    } catch (error) {
        console.error('Error searching music:', error);
        return [];
    }
};

// Toggle liked item for movies
router.post('/toggle-liked-movies', auth, async (req, res) => {
    const { item } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        toggleItemInList(user.likedMovies, item);
        await user.save();
        res.status(200).json(user.likedMovies);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get liked movies
router.get('/liked-movies/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select('likedMovies');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.likedMovies);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
