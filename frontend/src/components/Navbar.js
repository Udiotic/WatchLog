import './Navbar.css'
import { Link } from 'react-router-dom';
import { FaMoon } from "react-icons/fa";


// sexy boy udit surve
function Navbar(){
  return(
    <nav>
  <div className="nav-bar">
    <span className="logo navLogo">
    <Link to="/home">Watchlog</Link>
    </span>
    <div className="menu">
      <ul className="nav-links">
        <li>
          <Link to="/movies">Movies</Link>
        </li>
        <li>
        <Link to="/shows">Shows</Link>
        </li>
        <li>
        <Link to="/books">Books</Link>
        </li>
        <li>
        <Link to="/music">Music</Link>
        </li>
        <li>
          <Link to="/games">Games</Link>
        </li>
      </ul>
    </div>
        <div className = "Moon"><FaMoon/></div>
      <div className="searchBox">
        <div className="search-field">
          <input type="text" placeholder="Search..." />
        </div>
      </div>
    
  </div>
  
</nav>

  );
}

export default Navbar;