import React, { createContext, useContext, useState, useEffect } from 'react';
import authStore from '../store/authStore';

const DatabaseContext = createContext();

export const DatabaseProvider = ({ children }) => {
  const [recommendedPath, setRecommendedPath] = useState(null);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const token = authStore((state) => state.token);
  
  const fetchAchievements = async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/get-achievements`, {
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
  
  // Fetch question history for the user
  const fetchQuestionHistory = async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user-history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch question history');
      }
      
      const data = await response.json();
      setQuestionHistory(data);
    } catch (err) {
      console.error('Error fetching question history:', err);
      setError('Failed to load your question history');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Refresh data when token changes
  useEffect(() => {
    if (token) {
      fetchRecommendedPath();
      fetchQuestionHistory();
    } else {
      // Clear data when user logs out
      setRecommendedPath(null);
      setQuestionHistory([]);
    }
  }, [token]);
  
  // Expose the context values
  const value = {
    recommendedPath,
    questionHistory,
    isLoading,
    error,
    refreshRecommendedPath: fetchRecommendedPath,
    refreshQuestionHistory: fetchQuestionHistory
  };
  
  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => useContext(DatabaseContext);