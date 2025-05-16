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

// New function that evaluates the last 10 questions from a user's history
export const getProgressColor = (history = []) => {
  // If no history provided or not an array, return transparent
  if (!Array.isArray(history) || history.length === 0) {
    return ProgressColors.TRANSPARENT;
  }
  
  // Get the last 10 questions (most recent first)
  const last10Questions = history.sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  ).slice(0, 10);
  
  // If fewer than 10 questions, return transparent (gray)
  if (last10Questions.length < 10) {
    return ProgressColors.TRANSPARENT;
  }
  
  // Count correct answers and total time
  let correctCount = 0;
  let totalTime = 0;
  
  for (const question of last10Questions) {
    if (question.correct) {
      correctCount += 1;
    }
    totalTime += question.time_spent;
  }
  
  const averageTime = totalTime / 10;
  
  // Determine color based on correct count and average time
  if (correctCount >= 8) {
    if (averageTime > 15) {
      return ProgressColors.YELLOW; // Good accuracy but slow
    } else {
      return ProgressColors.GREEN; // Good accuracy and fast
    }
  } else {
    return ProgressColors.RED; // Poor accuracy
  }
};

// Legacy function for backward compatibility - takes an accuracy value
export const getLegacyProgressColor = (accuracy) => {
  if (!accuracy || accuracy === 0) return ProgressColors.TRANSPARENT;
  if (accuracy >= 0.8) return ProgressColors.GREEN;
  if (accuracy >= 0.5) return ProgressColors.YELLOW;
  return ProgressColors.RED;
};

export const DatabaseProvider = ({ children }) => {
  const [recommendedPath, setRecommendedPath] = useState(null);
  const [categoryStats, setCategoryStats] = useState(null);
  const [userHistory, setUserHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const token = authStore((state) => state.token);

  // Process category stats to include classification
  const processedCategoryStats = useMemo(() => {
    if (!categoryStats) return null;
    if (!userHistory) return null; // Need history data for new classification

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

    // Group history entries by moment for classification
    const historyByMoment = {};
    userHistory.forEach(entry => {
      const moment = entry.moment;
      if (!moment) return;
      
      if (!historyByMoment[moment]) {
        historyByMoment[moment] = [];
      }
      historyByMoment[moment].push(entry);
    });

    // Calculate accuracy and classify each moment
    return Object.entries(aggregatedStats).map(([moment, stats]) => {
      const accuracy = stats.total_answers > 0 ? stats.correct / stats.total_answers : 0;
      const momentHistory = historyByMoment[moment] || [];
      
      return {
        moment,
        total_answers: stats.total_answers,
        correct: stats.correct,
        accuracy,
        recent_questions: momentHistory.length,
        classification: getProgressColor(momentHistory),
        legacy_classification: getLegacyProgressColor(accuracy)
      };
    });
  }, [categoryStats, userHistory]);
  
  // Group user history by moments
  const processedUserHistory = useMemo(() => {
    if (!userHistory) return null;
    
    // Group entries by moment
    const historyByMoment = {};
    userHistory.forEach(entry => {
      const moment = entry.moment;
      if (!moment) return;
      
      if (!historyByMoment[moment]) {
        historyByMoment[moment] = [];
      }
      historyByMoment[moment].push(entry);
    });
    
    return historyByMoment;
  }, [userHistory]);
  
  const fetchAchievements = async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchAchievementsData();
      if (data) {
        setRecommendedPath(data);
      }
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
      const data = await fetchCategoryStatsData();
      if (data) {
        setCategoryStats(data);
      }
    } catch (err) {
      console.error('Error fetching category stats:', err);
      setError('Failed to load your category stats');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch detailed user history 
  const fetchUserHistory = async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchUserHistoryData();
      if (data) {
        setUserHistory(data);
      }
    } catch (err) {
      console.error('Error fetching user history:', err);
      setError('Failed to load your learning history');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get history for a specific moment
  const getMomentHistory = (momentId) => {
    if (!processedUserHistory || !momentId) return [];
    return processedUserHistory[momentId] || [];
  };
  
  // Refresh all user data including stats and history
  const refreshUserData = async () => {
    if (!token) return;
    
    console.log('Refreshing all user data...');
    
    try {
      // Store current values for comparison
      const prevCategoryStats = categoryStats;
      const prevUserHistory = userHistory;
      
      // Run all fetch operations in parallel for performance
      const [newCategoryStats, newUserHistory, newRecommendedPath] = await Promise.all([
        fetchCategoryStatsData(),
        fetchUserHistoryData(),
        fetchAchievementsData()
      ]);
      
      // Only update state when data has actually changed
      if (JSON.stringify(newCategoryStats) !== JSON.stringify(categoryStats)) {
        setCategoryStats(newCategoryStats);
      }
      
      if (JSON.stringify(newUserHistory) !== JSON.stringify(userHistory)) {
        setUserHistory(newUserHistory);
      }
      
      if (JSON.stringify(newRecommendedPath) !== JSON.stringify(recommendedPath)) {
        setRecommendedPath(newRecommendedPath);
      }
      
      console.log('All user data refreshed successfully');
    } catch (err) {
      console.error('Error refreshing user data:', err);
    }
  };
  
  // Helper functions that fetch data but don't update state
  const fetchCategoryStatsData = async () => {
    try {
      console.log('Fetching category stats data...');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/general/category_stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching category stats data:', error);
      return null;
    }
  };
  
  const fetchUserHistoryData = async () => {
    try {
      console.log('Fetching user history data...');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/general/user_history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user history data:', error);
      return null;
    }
  };
  
  const fetchAchievementsData = async () => {
    try {
      console.log('Fetching achievements data...');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/general/user_achievements`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching achievements data:', error);
      return null;
    }
  };
  
  // Refresh data when token changes
  useEffect(() => {
    if (token) {
      fetchAchievements();
      fetchCategoryStats();
      fetchUserHistory();
    } else {
      // Clear data when user logs out
      setRecommendedPath(null);
      setCategoryStats(null);
      setUserHistory(null);
    }
  }, [token]);
  
  // Expose the context values
  const value = {
    recommendedPath,
    categoryStats: processedCategoryStats, // Now includes classification
    rawCategoryStats: categoryStats, // Original stats if needed
    userHistory: processedUserHistory,
    isLoading,
    error,
    refreshAchievements: fetchAchievements,
    refreshCategoryStats: fetchCategoryStats,
    refreshUserHistory: fetchUserHistory,
    refreshUserData, // Add the new comprehensive refresh function
    getMomentHistory,
    getProgressColor, // Expose the classification function
    ProgressColors, // Expose the color constants
    getLegacyProgressColor // Expose the legacy classification function
  };
  
  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => useContext(DatabaseContext);