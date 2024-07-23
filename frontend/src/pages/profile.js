import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import EditBioDialog from '../components/EditBioDialog';
import UploadAvatarDialog from '../components/UploadAvatarDialog';
import FollowersDialog from '../components/FollowersDialog';
import UserFilms from '../pages/user-films/User-films';
import UserShows from '../pages/user-shows/User-shows'; // Import UserShows component
import './profile.css';
import defaultAvatar from '../images/default-avatar.png';

const Profile = () => {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isEditBioOpen, setIsEditBioOpen] = useState(false);
    const [isUploadAvatarOpen, setIsUploadAvatarOpen] = useState(false);
    const [isFollowersDialogOpen, setIsFollowersDialogOpen] = useState(false);
    const [isFollowingDialogOpen, setIsFollowingDialogOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const validTabs = ['films', 'shows', 'books', 'games', 'music'];
    const currentTab = location.pathname.split('/')[3];
    const activeTab = validTabs.includes(currentTab) ? currentTab : 'overview';

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/user/profile/${username}`);
                setUser(response.data);

                const token = localStorage.getItem('token');
                if (token) {
                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': token
                        }
                    };
                    const currentUserResponse = await axios.get('http://localhost:5000/api/user/profile', config);
                    setCurrentUser(currentUserResponse.data);
                }
            } catch (error) {
                console.error('Error fetching user profile', error);
            }
        };
        fetchUserProfile();
    }, [username]);

    const handleEditBioClick = () => {
        setIsEditBioOpen(true);
    };

    const handleAvatarClick = () => {
        setIsUploadAvatarOpen(true);
    };

    const handleFollowClick = async () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                }
            };
            const response = await axios.post(`http://localhost:5000/api/user/follow/${user._id}`, {}, config);
            setUser(prevState => ({
                ...prevState,
                followers: response.data.followers
            }));
            setCurrentUser(prevState => ({
                ...prevState,
                following: response.data.following
            }));
        } catch (error) {
            console.error('Error following/unfollowing user', error);
        }
    };

    const handleFollowersClick = () => {
        setIsFollowersDialogOpen(true);
    };

    const handleFollowingClick = () => {
        setIsFollowingDialogOpen(true);
    };

    if (!user) return <div className="loading">Loading...</div>;

    const avatarUrl = user.pfp ? `data:image/jpeg;base64,${user.pfp}` : defaultAvatar;

    const isCurrentUser = currentUser && currentUser.username === user.username;
    const isFollowing = currentUser && user.followers.some(follower => follower._id === currentUser._id);

    return (
        <div>
            <Navbar />
            <div className="profile-page">
                <div className="profile-header">
                    <div className="profile-left">
                        <img src={avatarUrl} alt="User Avatar" className="avatar" onClick={isCurrentUser ? handleAvatarClick : null} />
                        <div className="profile-info">
                            <div className="info-top">
                                <h1>{user.username}</h1>
                                {!isCurrentUser && (
                                    <button className="follow-button" onClick={handleFollowClick}>
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </button>
                                )}
                                <div className="followers-following">
                                    <div onClick={handleFollowersClick}>
                                        <span>Followers</span>
                                        <span>{user.followers ? user.followers.length : 0}</span>
                                    </div>
                                    <div onClick={handleFollowingClick}>
                                        <span>Following</span>
                                        <span>{user.following ? user.following.length : 0}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bio-container">
                                <p className="bio">{user.bio || "This user hasn't written a bio yet."}</p>
                                {isCurrentUser && <button className="edit-bio-button" onClick={handleEditBioClick}>✏️</button>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="profile-tabs">
                    <Link
                        to={`/profile/${username}`}
                        className={`profile-tab ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={(e) => {
                            if (activeTab === 'overview') {
                                e.preventDefault();
                            }
                        }}
                    >
                        Overview
                    </Link>
                    {['Films', 'Shows', 'Books', 'Games', 'Music'].map(tab => (
                        <Link
                            key={tab}
                            to={`/profile/${username}/${tab.toLowerCase()}`}
                            className={`profile-tab ${activeTab === tab.toLowerCase() ? 'active' : ''}`}
                        >
                            {tab}
                        </Link>
                    ))}
                </div>
                <div className="profile-content">
                    <Routes>
                        <Route path="films/*" element={<UserFilms />} />
                        <Route path="shows/*" element={<UserShows />} /> // Updated to use UserShows
                        <Route path="books" element={<div>Books Content</div>} />
                        <Route path="games" element={<div>Games Content</div>} />
                        <Route path="music" element={<div>Music Content</div>} />
                        <Route path="/" element={<div>Overview Content</div>} />
                    </Routes>
                </div>
            </div>
            <EditBioDialog
                isOpen={isEditBioOpen}
                onClose={() => setIsEditBioOpen(false)}
                bio={user.bio}
                setUser={setUser}
            />
            <UploadAvatarDialog
                isOpen={isUploadAvatarOpen}
                onClose={() => setIsUploadAvatarOpen(false)}
                setUser={setUser}
            />
            <FollowersDialog
                open={isFollowersDialogOpen}
                onClose={() => setIsFollowersDialogOpen(false)}
                title="Followers"
                users={user.followers || []}
            />
            <FollowersDialog
                open={isFollowingDialogOpen}
                onClose={() => setIsFollowingDialogOpen(false)}
                title="Following"
                users={user.following || []}
            />
        </div>
    );
};

export default Profile;
