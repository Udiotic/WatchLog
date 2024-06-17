import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import EditBioDialog from '../components/EditBioDialog';
import UploadAvatarDialog from '../components/UploadAvatarDialog';
import FollowersDialog from '../components/FollowersDialog';
import './profile.css';
import defaultAvatar from '../images/default-avatar.png'; // Adjust the path accordingly

const Profile = () => {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isEditBioOpen, setIsEditBioOpen] = useState(false);
    const [isUploadAvatarOpen, setIsUploadAvatarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Overview');
    const [isFollowersDialogOpen, setIsFollowersDialogOpen] = useState(false);
    const [isFollowingDialogOpen, setIsFollowingDialogOpen] = useState(false);
    const navigate = useNavigate();

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
    const isFollowing = currentUser && currentUser.following.some(f => f.toString() === user._id.toString());

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
                    {['Overview', 'Movies', 'Shows', 'Books', 'Games', 'Music'].map(tab => (
                        <div 
                            key={tab} 
                            className={`profile-tab ${activeTab === tab ? 'active' : ''}`} 
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                </div>
                <div className="profile-content">
                    {/* Content for each tab will go here */}
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
