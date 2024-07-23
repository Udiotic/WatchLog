import axios from 'axios';

const API_KEY = 'f0f9d58822fe556416d0a868289cd971';
const BASE_URL = 'http://ws.audioscrobbler.com/2.0/';

export const searchMusic = async (query, limit = 10) => {
    const response = await axios.get(BASE_URL, {
        params: {
            method: 'album.search',
            album: query,
            api_key: API_KEY,
            format: 'json',
        },
    });

    return response.data.results.albummatches.album.slice(0, limit).map(music => ({
        id: music.mbid || `${music.name}|${music.artist}`, // Use mbid if available, otherwise use a fallback
        name: music.name,
        image: music.image[3]['#text'], // Assuming image[3] is the largest image
        artist: music.artist,
    }));
};

export const getAlbumDetails = async (albumId) => {
    let params = {
        method: 'album.getinfo',
        api_key: API_KEY,
        format: 'json',
    };

    // Check if albumId contains the fallback pattern
    if (albumId.includes('|')) {
        const [albumName, artistName] = albumId.split('|');
        params.album = albumName;
        params.artist = artistName;
    } else {
        params.mbid = albumId;
    }

    try {
        const response = await axios.get(BASE_URL, { params });
        console.log('Album details response:', response.data);
        return response.data.album;
    } catch (error) {
        console.error('Error fetching album details:', error);
        return null;
    }
};

