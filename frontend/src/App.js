import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import Landing from './pages/landing';
import Films from './pages/films';
import Games from './pages/games';
import Books from './pages/books';
import TVshows from './pages/tvshows';
import Music from './pages/music';
import MovieDetails from './details/MovieDetails';
import TVShowDetails from './details/TvshowDetails';
import BookDetails from './details/BookDetails';
import GameDetails from './details/GameDetails';
import MusicDetails from './details/MusicDetails';
import { AuthProvider } from './context/authprovider';
import Profile from './pages/profile';
import VerifyEmail from './components/verifyEmail';
import ListDetails from './pages/user-films/listdetails';
import Lists from './pages/user-films/Lists';
import SearchResults from './components/SearchResults'; // Import the SearchResults component

function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/tvshows/:id" element={<TVShowDetails />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/games/:id" element={<GameDetails />} />
          <Route path="/music/:id" element={<MusicDetails />} />
          <Route path="/profile/:username/*" element={<Profile />}>
            <Route path="lists" element={<Lists />} />
            <Route path="lists/:listName" element={<ListDetails />} />
          </Route>
          <Route path="/verify-email" element={<VerifyEmail />} /> 
          <Route path="/films" element={<Films />} />
          <Route path="/shows" element={<TVshows />} />
          <Route path="/books" element={<Books />} />
          <Route path="/games" element={<Games />} />
          <Route path="/music" element={<Music />} />
          <Route path="/search-results/:query" element={<SearchResults />} /> {/* Add search results route */}
        </Routes>
    </AuthProvider>
  );
}

export default App;
