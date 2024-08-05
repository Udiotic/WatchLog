import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './activity.css'; // Import CSS for styling

const Activity = () => {
    const { username } = useParams();
    const [recentActivities, setRecentActivities] = useState([]);

    useEffect(() => {
        const fetchRecentActivities = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/user/recent-activities/${username}`);
                setRecentActivities(response.data);
            } catch (error) {
                console.error('Error fetching recent activities:', error);
            }
        };

        fetchRecentActivities();
    }, [username]);

    return (
        <div className="activity-page">
            <h2>Recent Activities</h2>
            {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                    <div key={index} className="activity-item">
                        <div className="activity-details">
                            <p>{activity.type === 'watched' && `Watched ${activity.title}`}</p>
                            <p>{activity.type === 'review' && `Reviewed ${activity.title}`}</p>
                            <p>{activity.type === 'watchlist' && `Added ${activity.title} to watchlist`}</p>
                            <span>{new Date(activity.date).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))
            ) : (
                <p>No recent activities</p>
            )}
        </div>
    );
};

export default Activity;
