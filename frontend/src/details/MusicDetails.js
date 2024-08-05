import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getAlbumDetails } from '../api/lastfmApi';
import './Details.css';
import Navbar from "../components/Navbar"


const MusicDetails = () => {
    const { id } = useParams();
    const [album, setAlbum] = useState(null);

    useEffect(() => {
        const fetchAlbumDetails = async () => {
            const details = await getAlbumDetails(id);
            setAlbum(details);
        };
        fetchAlbumDetails();
    }, [id]);

    const toggleItem = async (listType) => {
        try {
            const log = {
                item: {
                    id: album.mbid || `${album.name}|${album.artist}`,
                    title: album.name,
                    poster_path: album.image[3]['#text'],
                },
            };

            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
            };

            const url = listType === 'listened'
                ? 'http://localhost:5001/api/user/toggle-listened-music'
                : 'http://localhost:5001/api/user/toggle-playlist-music';

            const response = await axios.post(url, log, config);
            console.log('Response:', response);
            alert(`Album ${listType} updated successfully`);
        } catch (error) {
            console.error(`Error toggling album ${listType}`, error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
            }
        }
    };

    if (!album) return <div>Loading...</div>;

    // Remove HTML tags from the summary
    const summary = album.wiki && album.wiki.summary.replace(/<\/?[^>]+(>|$)/g, "");

    return (
        <div><Navbar/>
        <div className="details-page">
            <div className="content">
                <div className="details-header">
                    <h1>{album.name}</h1>
                    <span className="release-year">{album.artist}</span>
                </div>
                <div className="details-body">
                    <div className="summary">{summary}</div>
                </div>
            </div>
            <div className="poster-container">
                <img src={album.image[3]['#text']} alt={album.name} className="poster-image" />
            </div>
            <div className="options">
                <button onClick={() => toggleItem('listened')}>Listened</button>
                <button onClick={() => toggleItem('playlist')}>Add to Playlist</button>
            </div>
        </div>
        </div>
    );
};

export default MusicDetails;
