import React, { useState, useEffect } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';

const UserStatsPage = () => {
  const { recommendedPath, questionHistory, isLoading, error } = useDatabase();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Användarstatistik</h1>
        <p>Laddar...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Användarstatistik</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Användarstatistik</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Rekommenderad väg</h2>
        {recommendedPath ? (
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
            {JSON.stringify(recommendedPath, null, 2)}
          </pre>
        ) : (
          <p>Ingen rekommenderad väg tillgänglig</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Frågehistorik</h2>
        {questionHistory && questionHistory.length > 0 ? (
          <div className="space-y-4">
            {questionHistory.map((question, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg">
                <pre className="overflow-auto">
                  {JSON.stringify(question, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        ) : (
          <p>Ingen frågehistorik tillgänglig</p>
        )}
      </div>
    </div>
  );
};

export default UserStatsPage;
