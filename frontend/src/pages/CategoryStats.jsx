import React from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import MomentTree from '../components/MomentTree';
import { useNavigate } from 'react-router-dom';

export const CategoryStats = () => {
  const { categoryStats, isLoading, error } = useDatabase();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl px-4 py-8 relative flex justify-center items-center min-h-[200px]">
        Laddar data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl px-4 py-8 relative text-red-600 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl px-4 py-8 relative">
      <button
        onClick={() => navigate('/main-menu')}
        className="absolute top-4 left-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Tillbaka
      </button>

      <div className="space-y-4 mt-16">
        <h2 className="text-xl font-bold text-blue-600 mb-4 text-center">
          Dina framsteg per kategori
        </h2>

        <MomentTree 
          stats={categoryStats} 
          isLoading={isLoading}
          error={error}
          onBack={() => navigate('/main-menu')}
        />
      </div>
    </div>
  );
};
