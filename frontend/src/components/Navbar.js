import './Navbar.css'
import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { FaMoon } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { MdOutlineWbSunny } from "react-icons/md";


function Navbar(){
  return(
    <nav>
  <div className="nav-bar">
    <span className="logo navLogo">
      <a href="#home">WatchLog</a>
    </span>
    <div className="menu">
      <ul className="nav-links">
        <li>
          <a href="#Movies">Movies</a>
        </li>
        <li>
          <a href="#Shows">Shows</a>
        </li>
        <li>
          <a href="#Books">Books</a>
        </li>
        <li>
          <a href="#Music">Music</a>
        </li>
        <li>
          <a href="#Games">Games</a>
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