import './App.css';
// import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import Landing from './pages/landing';
import { AuthProvider } from './context/authprovider';
function App() {
  return (
    <AuthProvider>
    <Routes>
    <Route exact path="/" element={<Login/>} />
    <Route exact path = "/signup" element = {<Signup/>} />
    <Route exact path = "/login" element = {<Login/>} />
    <Route exact path = "/landing" element = {<Landing/>}/>
    </Routes>
    </AuthProvider>

  );
}

export default App;
