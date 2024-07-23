const mongoose = require('mongoose');

const JournalEntrySchema = new mongoose.Schema({
    movieId: { type: Number },
    tvShowId: { type: Number },
    title: { type: String, required: true },
    poster_path: { type: String },
    rating: { type: Number },
    date: { type: Date, required: true },
    review: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const ActivitySchema = new mongoose.Schema({
    type: { type: String, required: true },
    movieId: { type: Number },
    tvShowId: { type: Number },
    title: { type: String, required: true },
    poster_path: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const MovieSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    poster_path: { type: String }
});

const TVShowSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    poster_path: { type: String }
});

const FavoriteSchema = new mongoose.Schema({
    movieId: { type: Number },
    tvShowId: { type: Number },
    title: { type: String, required: true },
    poster_path: { type: String }
});

const ListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    movies: [MovieSchema],
    tvShows: [TVShowSchema],
    books: [MovieSchema],
    games: [MovieSchema],
    music: [MovieSchema]
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    pfp: { type: String, required: false },
    bio: { type: String, required: false },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    watchedMovies: [MovieSchema],
    watchlistMovies: [{ type: Object }],
    journalEntries: [JournalEntrySchema],
    watchedTVShows: [TVShowSchema],
    watchlistTVShows: [TVShowSchema],
    watchingShows: [TVShowSchema],
    favoriteShows: {
        allTime: [FavoriteSchema],
        year: [FavoriteSchema],
        month: [FavoriteSchema],
        week: [FavoriteSchema]
    },
    readBooks: [{ type: Object }],
    readingList: [{ type: Object }],
    playedGames: [{ type: Object }],
    gameList: [{ type: Object }],
    listenedMusic: [{ type: Object }],
    playlist: [{ type: Object }],
    lists: [ListSchema],
    favoriteMovies: {
        allTime: [FavoriteSchema],
        year: [FavoriteSchema],
        month: [FavoriteSchema],
        week: [FavoriteSchema]
    },
    recentActivities: [ActivitySchema],
    likedMovies: [MovieSchema]
});

UserSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

UserSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('User', UserSchema);
