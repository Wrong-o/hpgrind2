import React, { createContext, useContext, useState, useEffect } from 'react';
import authStore from '../store/authStore';

const DatabaseContext = createContext();

export const DatabaseProvider = ({ children }) => {
  const [recommendedPath, setRecommendedPath] = useState(null);
  const [categoryStats, setCategoryStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const token = authStore((state) => state.token);
  
  const fetchAchievements = async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/general/user_achievements`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch achievements');
      }
      
      const data = await response.json();
      setRecommendedPath(data);
    } catch (err) {
      console.error('Error fetching achievements:', err);
      setError('Failed to load your achievements');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch category stats for the user
  const fetchCategoryStats = async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/general/category_stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch category stats');
      }
      
      const data = await response.json();
      setCategoryStats(data);
    } catch (err) {
      console.error('Error fetching category stats:', err);
      setError('Failed to load your category stats');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Refresh data when token changes
  useEffect(() => {
    if (token) {
      fetchAchievements();
      fetchCategoryStats();
    } else {
      // Clear data when user logs out
      setRecommendedPath(null);
      setCategoryStats(null);
    }
  }, [token]);
  
  // Expose the context values
  const value = {
    recommendedPath,
    categoryStats,
    isLoading,
    error,
    refreshAchievements: fetchAchievements,
    refreshCategoryStats: fetchCategoryStats
  };
  
  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => useContext(DatabaseContext);