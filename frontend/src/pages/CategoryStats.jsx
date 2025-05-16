import React from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import MomentTree from '../components/MomentTree';
import { useNavigate } from 'react-router-dom';
//
export const CategoryStats = () => {
  const { categoryStats, userHistory, isLoading, error } = useDatabase();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="w-full px-4 py-8 relative flex justify-center items-center min-h-[200px]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Laddar statistik...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 py-8 relative text-red-600 text-center">
        <p className="font-medium">{error}</p>
        <button 
          onClick={() => navigate('/main-menu')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Tillbaka till menyn
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <MomentTree 
        stats={categoryStats || []}
        isLoading={isLoading}
        error={error}
        onBack={() => navigate('/main-menu')}
      />
    </div>
  );
};
