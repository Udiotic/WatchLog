// pages/user-films/UserFilms.js
import React from 'react';
import { Link, Routes, Route, useParams, useLocation, Navigate } from 'react-router-dom';
import FilmsHome from './FilmsHome';
import Watched from './Watched';
import Watchlist from './Watchlist';
import Journal from './Journal';
import Lists from './Lists';
import Activity from './Activity';
import Stats from './Stats';
import './user-films.css'; // Add CSS file for styling
import ListDetails from './listdetails';

const UserFilms = () => {
    const { username } = useParams();
    const location = useLocation();

    const validTabs = ['watched', 'watchlist', 'journal', 'lists', 'activity', 'stats'];
    const currentTab = location.pathname.split('/').pop();
    const activeTab = validTabs.includes(currentTab) ? currentTab : '';

    return (
        <div className="user-films-page">
            <div className="sidebar">
                <Link
                    to={`/profile/${username}/films`}
                    className={`sidebar-tab ${activeTab === '' ? 'active' : ''}`}
                >
                    HOME
                </Link>
                {['Watched', 'Watchlist', 'Journal', 'Lists', 'Activity', 'Stats'].map(tab => (
                    <Link
                        key={tab}
                        to={`/profile/${username}/films/${tab.toLowerCase()}`}
                        className={`sidebar-tab ${activeTab === tab.toLowerCase() ? 'active' : ''}`}
                    >
                        {tab.toUpperCase()}
                    </Link>
                ))}
            </div>
            <div className="main-content-films">
                <Routes>
                    <Route path="/" element={<FilmsHome />} />
                    <Route path="watched" element={<Watched />} />
                    <Route path="watchlist" element={<Watchlist />} />
                    <Route path="journal" element={<Journal />} />
                    <Route path="lists" element={<Lists />} />
                    <Route path="lists/:listName" element = {<ListDetails/>}/>
                    <Route path="activity" element={<Activity />} />
                    <Route path="stats" element={<Stats />} />
                    <Route path="*" element={<Navigate to={`/profile/${username}/films`} />} />
                </Routes>
            </div>
        </div>
    );
};

export default UserFilms;
