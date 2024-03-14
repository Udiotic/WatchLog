import './App.css';
import Navbar from './components/Navbar.js';
import Movies from './components/Movies.js';
import { BrowserRouter } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
    <div>
      <Navbar/>
      <Movies/>
    </div>
    </BrowserRouter>
    
  );
}

export default App;
