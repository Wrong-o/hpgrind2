import React from 'react';
import { useNavigate } from 'react-router-dom';

const ResultPage = ({ results, onReset }) => {
  const navigate = useNavigate();

  // Calculate statistics
  const totalQuestions = results?.length || 0;
  const correctAnswers = results?.filter(result => result.correct).length || 0;
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const averageTime = results?.reduce((acc, curr) => acc + curr.timeSpent, 0) / totalQuestions || 0;

  const handleRetry = () => {
    onReset();
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">Quiz Resultat</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <p className="text-lg text-gray-600">Noggrannhet</p>
            <p className="text-4xl font-bold text-blue-600">{accuracy.toFixed(1)}%</p>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <p className="text-lg text-gray-600">Rätt svar</p>
            <p className="text-4xl font-bold text-blue-600">{correctAnswers}/{totalQuestions}</p>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg text-center md:col-span-2">
            <p className="text-lg text-gray-600">Genomsnittligt svarstid</p>
            <p className="text-4xl font-bold text-blue-600">{averageTime.toFixed(0)}s</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRetry}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Kör en till
          </button>
          <button
            onClick={handleBackToHome}
            className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Huvudmeny
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
