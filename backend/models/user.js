const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
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
    isVerified: {
        type: Boolean,
        default: false
    },
    pfp: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
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

UserSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

UserSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('User', UserSchema);
