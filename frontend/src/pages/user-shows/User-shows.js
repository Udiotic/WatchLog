import React from 'react';
import { Link, Routes, Route, useParams, useLocation, Navigate } from 'react-router-dom';
import ShowsHome from './ShowsHome';
import Completed from './Completed';
import Watching from './Watching';
import Watchlist from './Watchlist';
import Journal from './JournalShows';
import Lists from './Lists';
import Activity from './Activity';
import Stats from './Stats';
import './user-shows.css';

const UserShows = () => {
    const { username } = useParams();
    const location = useLocation();

    const validTabs = ['completed', 'watching', 'watchlist', 'journal', 'lists', 'activity', 'stats'];
    const currentTab = location.pathname.split('/').pop();
    const activeTab = validTabs.includes(currentTab) ? currentTab : '';

    return (
        <div className="user-shows-page">
            <div className="sidebar-shows">
                <Link
                    to={`/profile/${username}/shows`}
                    className={`sidebar-tab-shows ${activeTab === '' ? 'active' : ''}`}
                >
                    HOME
                </Link>
                {['Completed', 'Watching', 'Watchlist', 'Journal', 'Lists', 'Activity', 'Stats'].map(tab => (
                    <Link
                        key={tab}
                        to={`/profile/${username}/shows/${tab.toLowerCase()}`}
                        className={`sidebar-tab-shows ${activeTab === tab.toLowerCase() ? 'active' : ''}`}
                    >
                        {tab.toUpperCase()}
                    </Link>
                ))}
            </div>
            <div className="main-content-shows">
                <Routes>
                    <Route path="/" element={<ShowsHome />} />
                    <Route path="completed" element={<Completed />} />
                    <Route path="watching" element={<Watching />} />
                    <Route path="watchlist" element={<Watchlist />} />
                    <Route path="journal" element={<Journal />} />
                    <Route path="lists" element={<Lists />} />
                    <Route path="activity" element={<Activity />} />
                    <Route path="stats" element={<Stats />} />
                    <Route path="*" element={<Navigate to={`/profile/${username}/shows`} />} />
                </Routes>
            </div>
        </div>
    );
};

export default UserShows;
