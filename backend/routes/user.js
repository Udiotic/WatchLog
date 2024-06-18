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
        removeItemFromList(user.watchlistMovies, item);
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


module.exports = router;
