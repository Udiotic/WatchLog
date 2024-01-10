import './Navbar.css'
import React, { useEffect, useState } from 'react';
import './YourComponent.css'; // Import your CSS file

const Searchbar = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('mode') === 'dark-mode');
  const [searchActive, setSearchActive] = useState(false);

  useEffect(() => {
    // Update the local storage when dark mode changes
    localStorage.setItem('mode', darkMode ? 'dark-mode' : 'light-mode');
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSearchBox = () => {
    setSearchActive(!searchActive);
  };

  return (
    <nav>
      <div className={`nav-bar ${darkMode ? 'dark' : ''}`}>
        {/* ... other components ... */}
        <div className="darkLight-searchBox">
          <div className="dark-light" onClick={toggleDarkMode}>
            <i className={`bx ${darkMode ? 'bx-moon' : 'bx-sun'}`}></i>
          </div>

          <div className="searchBox">
            <div className={`searchToggle ${searchActive ? 'active' : ''}`} onClick={toggleSearchBox}>
              <i className={`bx ${searchActive ? 'bx-x cancel' : 'bx-search search'}`}></i>
            </div>

            <div className="search-field">
              <input type="text" placeholder="Search..." style={{ display: searchActive ? 'block' : 'none' }} />
              <i className={`bx bx-search`} style={{ display: searchActive ? 'block' : 'none' }}></i>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Searchbar;
