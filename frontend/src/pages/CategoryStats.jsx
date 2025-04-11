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


      <div className="space-y-4 mt-16">

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
