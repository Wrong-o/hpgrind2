import React, { useState, useEffect } from 'react';
import authStore from '../store/authStore';
import LoadingScreen from '../components/LoadingScreen';
import RowSteps from '../components/Stepper';

const UserStatsPage = () => {
    const token = authStore((state) => state.token);
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recommendedPath, setRecommendedPath] = useState("mememememem");
    const isLoggedIn = authStore((state) => state.isLoggedIn);
    const [userHistory, setUserHistory] = useState([]);
    
    useEffect(() => {
        const loadUserHistory = async () => {
            try {
                // Try to get cached user history first
                const cachedData = getCachedUserHistory();
                
                if (cachedData) {
                    console.log('Using cached user history data');
                    setUserHistory(cachedData);
                    return;
                }
                
                // If no cache or it's stale, fetch fresh data
                console.log('Fetching user history from API...');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/general/category_stats`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch user history');
                }
                
                const data = await response.json();
                
                // Cache the fetched data
                cacheUserHistory(data);
                
                setUserHistory(data);
            } catch (err) {
                console.error('Error loading user history:', err);
                // Don't set the error state here to avoid breaking the whole page
                // if only the history section fails
            }
        };
        
        if (isLoggedIn && token) {
            loadUserHistory();
        }
    }, [isLoggedIn, token]);
    
    // Function to get cached user history
    const getCachedUserHistory = () => {
        try {
            const cachedDataString = localStorage.getItem('userHistory');
            if (!cachedDataString) return null;
            
            const cachedData = JSON.parse(cachedDataString);
            const cacheTimestamp = cachedData.timestamp;
            const currentTime = new Date().getTime();
            
            // Cache is valid for 1 hour (3600000 ms)
            if (currentTime - cacheTimestamp > 60000) {
                return null;
            }
            
            return cachedData.history;
        } catch (error) {
            console.error('Error reading user history from cache:', error);
            return null;
        }
    };
    
    // Function to cache user history
    const cacheUserHistory = (data) => {
        try {
            const cacheData = {
                history: data,
                timestamp: new Date().getTime()
            };
            localStorage.setItem('userHistory', JSON.stringify(cacheData));
            console.log('User history cached successfully');
        } catch (error) {
            console.error('Error caching user history:', error);
        }
    };
    
    useEffect(() => {
        const loadAchievements = async () => {
            try {
                setLoading(true);
                
                // Try to get cached achievements first
                const cachedData = getCachedAchievements();
                
                if (cachedData) {
                    console.log('Using cached achievements data');
                    setAchievements(cachedData);
                    setLoading(false);
                    return;
                }
                
                // If no cache or it's stale, fetch fresh data
                console.log('Fetching achievements from API...');
                const data = await fetchAchievements();
                console.log('Achievements fetched successfully:', data);
                
                // Cache the fetched data
                cacheAchievements(data);
                
                setAchievements(data);
            } catch (err) {
                console.error('Error loading achievements:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        // Only load achievements if the user is logged in
        if (isLoggedIn && token) {
            loadAchievements();
        } else {
            setLoading(false);
        }
    }, [isLoggedIn, token]);
    
    // Function to get cached achievements
    const getCachedAchievements = () => {
        try {
            const cachedDataString = localStorage.getItem('userAchievements');
            if (!cachedDataString) return null;
            
            const cachedData = JSON.parse(cachedDataString);
            const cacheTimestamp = cachedData.timestamp;
            const currentTime = new Date().getTime();
            
            // Cache is valid for 1 hour (3600000 ms)
            if (currentTime - cacheTimestamp > 3600000) {
                console.log('Cache is stale, will fetch fresh data');
                return null;
            }
            
            return cachedData.achievements;
        } catch (error) {
            console.error('Error reading from cache:', error);
            return null;
        }
    };
    
    // Function to cache achievements
    const cacheAchievements = (data) => {
        try {
            const cacheData = {
                achievements: data,
                timestamp: new Date().getTime()
            };
            localStorage.setItem('userAchievements', JSON.stringify(cacheData));
            console.log('Achievements cached successfully');
        } catch (error) {
            console.error('Error caching achievements:', error);
        }
    };
    
    const fetchAchievements = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/general/user_achievements`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch achievements');
        }

        const data = await response.json();
        // Return array of achievement objects
        return data.map(entry => ({
            title: entry.achievement.title,
            description: entry.achievement.description
        }));
    }

    const hasAchievement = (title) => {
        return achievements.some(achievement => achievement.title === title);
    };

    // Function to manually refresh data
    const handleRefresh = async () => {
        try {
            setLoading(true);
            
            // Refresh achievements
            const achievementsData = await fetchAchievements();
            cacheAchievements(achievementsData);
            setAchievements(achievementsData);
            
            // Refresh user history
            const historyResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/general/category_stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            if (historyResponse.ok) {
                const historyData = await historyResponse.json();
                cacheUserHistory(historyData);
                setUserHistory(historyData);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center text-red-600 p-4 rounded-lg bg-red-50 border border-red-200">
                    <p>{error}</p>
                    <button 
                        onClick={handleRefresh}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Försök igen
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Stepper Component */}
                <div className="w-full flex justify-center mb-8">
                    <RowSteps
                        defaultStep={2}
                        steps={[
                            {
                                title: "Skapa konto",
                            },
                            {
                                title: "Kalibrera grunderna",
                            },
                            {
                                title: "Nå grön nivå på grunderna",
                            },
                            {
                                title: "Genomgå full kalibrering på delmoment",
                            },
                            {
                                title: "Nå minst gul på samtliga delmoment",
                            },
                            
                        ]}
                        /* This disables user interaction with the stepper */
                        className="pointer-events-none"
                        onStepChange={() => {}}
                    />
                </div>
                
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Användarstatistik
                    </h1>
                    <button 
                        onClick={handleRefresh} 
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Uppdatera
                    </button>
                </div>

                <section className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                        Rekommenderad väg
                    </h2>
                    <div className="bg-blue-50 rounded-lg p-4">
                        <ol className="list-decimal list-inside space-y-2">
                            <li className="text-gray-600 flex items-center">
                                <span>Skapa konto</span>
                                {isLoggedIn && (
                                    <svg className="w-5 h-5 ml-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </li>
                            <li className="text-gray-600 flex items-center">
                                <span>Kalibrera grunderna</span>
                                {hasAchievement("Välgrundad") && (
                                    <svg className="w-5 h-5 ml-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </li>
                            <li className="text-gray-600 flex items-center">
                                <span>Nå grön nivå på grunderna</span>
                                {hasAchievement("Kalibrerad och klar") && (
                                    <svg className="w-5 h-5 ml-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </li>
                            <li className="text-gray-600 flex items-center">
                                <span>Genomgå full kalibrering på delmoment</span>
                                {hasAchievement("Full Calibration Complete") && (
                                    <svg className="w-5 h-5 ml-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </li>
                            <li className="text-gray-600 flex items-center">
                                <span>Nå minst gul på samtliga delmoment</span>
                                {hasAchievement("All Yellow Level") && (
                                    <svg className="w-5 h-5 ml-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </li>
                            <li className="text-gray-600 flex items-center">
                                <span>Nå grön nivå på samtliga delmoment</span>
                                {hasAchievement("All Green Level") && (
                                    <svg className="w-5 h-5 ml-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </li>
                        </ol>
                    </div>
                </section>
                
                <section className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                        Prestationer
                    </h2>
                    <div className="bg-blue-50 rounded-lg p-4">
                        <div className="space-y-2">
                            {achievements.map((achievement, index) => (
                                <div key={index} className="flex items-center justify-between p-2 hover:bg-blue-100 rounded-lg">
                                    <span className="font-medium text-gray-700">{achievement.title}</span>
                                    <span className="text-gray-600">{achievement.description}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                        Frågehistorik
                    </h2>
                    <div className="bg-blue-50 rounded-lg p-4">
                        {userHistory.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr className="bg-blue-100 text-blue-700">
                                            <th className="py-2 px-4 text-left">Kategori</th>
                                            <th className="py-2 px-4 text-left">Svårighetsgrad</th>
                                            <th className="py-2 px-4 text-left">Antal svar</th>
                                            <th className="py-2 px-4 text-left">Antal korrekt</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userHistory.slice(0, 10).map((item, index) => (
                                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                                                <td className="py-2 px-4">{item.moment || "Okänd"}</td>
                                                <td className="py-2 px-4">{item.difficulty || "Okänd"}</td>
                                                <td className="py-2 px-4">{item.total_answers || "Okänd"}</td>
                                                <td className="py-2 px-4">{item.correct || "Okänd"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {userHistory.length > 10 && (
                                    <div className="mt-4 text-center text-sm text-gray-500">
                                        Visar de 10 senaste frågorna av {userHistory.length} totalt
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-600">Du har inte besvarat några frågor än.</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default UserStatsPage;