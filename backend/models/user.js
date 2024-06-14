const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    pfp: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    favorites: [{
        id: { type: String },
        title: { type: String },
        poster_path: { type: String }
    }],
    watchedMovies: [{ type: Object }],
    watchlistMovies: [{ type: Object }],
    watchedTVShows: [{ type: Object }],
    watchlistTVShows: [{ type: Object }],
    readBooks: [{ type: Object }],
    readingList: [{ type: Object }],
    playedGames: [{ type: Object }],
    gameList: [{ type: Object }],
    listenedMusic: [{ type: Object }],
    playlist: [{ type: Object }]
});

module.exports = mongoose.model('User', UserSchema);
