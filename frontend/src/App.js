import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import Landing from './pages/landing';
import Films from './pages/films';
import MovieDetails from './details/MovieDetails';
import TVShowDetails from './details/TvshowDetails';
import BookDetails from './details/BookDetails';
import GameDetails from './details/GameDetails';
import MusicDetails from './details/MusicDetails';
import { AuthProvider } from './context/authprovider';
import Profile from './pages/profile';
import VerifyEmail from './components/verifyEmail';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/landing" element={<Landing />} />
        <Route exact path="/movies/:id" element={<MovieDetails />} />
        <Route exact path="/tvshows/:id" element={<TVShowDetails />} />
        <Route exact path="/books/:id" element={<BookDetails />} />
        <Route exact path="/games/:id" element={<GameDetails />} />
        <Route exact path="/music/:id" element={<MusicDetails />} />
        <Route exact path="/profile/:username" element={<Profile />} />
        <Route exact path="/verify-email" element={<VerifyEmail />} /> 
        <Route exact path="/films" element = {<Films/>}/>
      </Routes>
    </AuthProvider>
  );
}

export default App;
