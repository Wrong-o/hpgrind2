import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import authStore from '../store/authStore';

const DatabaseContext = createContext();

// Progress classification thresholds and colors
export const ProgressColors = {
  RED: '#ff6b6b',
  YELLOW: '#feca57',
  GREEN: '#1dd1a1',
  TRANSPARENT: 'transparent'
};

export const getProgressColor = (accuracy) => {
  if (!accuracy || accuracy === 0) return ProgressColors.TRANSPARENT;
  if (accuracy >= 0.8) return ProgressColors.GREEN;
  if (accuracy >= 0.5) return ProgressColors.YELLOW;
  return ProgressColors.RED;
};

export const DatabaseProvider = ({ children }) => {
  const [recommendedPath, setRecommendedPath] = useState(null);
  const [categoryStats, setCategoryStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const token = authStore((state) => state.token);

  // Process category stats to include classification
  const processedCategoryStats = useMemo(() => {
    if (!categoryStats) return null;

    // Group stats by moment
    const aggregatedStats = {};
    categoryStats.forEach(item => {
      const nodeId = item.moment;
      if (!nodeId) return;

      if (!aggregatedStats[nodeId]) {
        aggregatedStats[nodeId] = { total_answers: 0, correct: 0 };
      }
      aggregatedStats[nodeId].total_answers += item.total_answers || 0;
      aggregatedStats[nodeId].correct += item.correct || 0;
    });

    // Calculate accuracy and classify each moment
    return Object.entries(aggregatedStats).map(([moment, stats]) => {
      const accuracy = stats.total_answers > 0 ? stats.correct / stats.total_answers : 0;
      return {
        moment,
        total_answers: stats.total_answers,
        correct: stats.correct,
        accuracy,
        classification: getProgressColor(accuracy)
      };
    });
  }, [categoryStats]);
  
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
    categoryStats: processedCategoryStats, // Now includes classification
    rawCategoryStats: categoryStats, // Original stats if needed
    isLoading,
    error,
    refreshAchievements: fetchAchievements,
    refreshCategoryStats: fetchCategoryStats,
    getProgressColor, // Expose the classification function
    ProgressColors // Expose the color constants
  };
  
  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => useContext(DatabaseContext);