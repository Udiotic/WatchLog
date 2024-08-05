import axios from 'axios';

const API_KEY = process.env.REACT_APP_LASTFM_API;
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

export const getTrendingMusic = async () => {
    try {
        const response = await axios.get(`${BASE_URL}`, {
            params: {
                method: 'chart.gettoptracks',
                api_key: API_KEY,
                format: 'json'
            }
        });
        return response.data.tracks.track.slice(0, 10).map(track => ({
            id: track.mbid || `${track.name}|${track.artist.name}`, // Use mbid or fallback
            name: track.name,
            artist: track.artist.name,
            image: track.image[3]['#text'] // Assuming image[3] is the largest image
        }));
    } catch (error) {
        console.error('Error fetching trending music:', error);
        return [];
    }
};

export const getPopularMusic = async () => {
    try {
        const response = await axios.get(`${BASE_URL}`, {
            params: {
                method: 'tag.gettopalbums', // Assuming 'popular' is based on a specific genre or tag
                tag: 'pop',
                api_key: API_KEY,
                format: 'json'
            }
        });
        return response.data.albums.album.slice(0, 10).map(album => ({
            id: album.mbid || `${album.name}|${album.artist.name}`,
            name: album.name,
            artist: album.artist.name,
            image: album.image[3]['#text']
        }));
    } catch (error) {
        console.error('Error fetching popular music:', error);
        return [];
    }
};
