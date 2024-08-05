// hooks/useCachedAPI.js
import { useEffect, useState } from 'react';

const useCachedAPI = (endpoint, expiryTime = 86400000) => {  // Default expiry time is 24 hours
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const cacheKey = `cache:${endpoint}`;
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                const { expiry, value } = JSON.parse(cachedData);
                if (expiry > Date.now()) {
                    setData(value);
                    setLoading(false);
                    return;
                }
            }

            try {
                const response = await fetch(endpoint);
                const result = await response.json();
                localStorage.setItem(cacheKey, JSON.stringify({ expiry: Date.now() + expiryTime, value: result }));
                setData(result);
                setLoading(false);
            } catch (error) {
                console.error('API fetch failed:', error);
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint, expiryTime]);

    return { data, loading, error };
};

export default useCachedAPI;
