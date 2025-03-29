import React, { useState, useEffect } from 'react';
import authStore from '../store/authStore';

const UserStatsPage = () => {
    const token = authStore((state) => state.token);
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadAchievements = async () => {
            try {
                console.log('Fetching achievements...');
                const data = await fetchAchievements();
                console.log('Achievements fetched successfully:', data);
                setAchievements(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadAchievements();
    }, []);

    const fetchAchievements = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/general/user_achievements`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch achievements');
        }

        const text = await response.text();  // Use .text() instead of .json() since we're expecting a string
        return text;
    }

    return (
        <div>
            <h1>Användarstatistik</h1>
            <h2>Rekommenderad väg</h2>
            
            <h2>Prestationer</h2>
            <p>{achievements}</p>

            <h2>Frågehistorik</h2>
        </div>
    )
}

export default UserStatsPage;