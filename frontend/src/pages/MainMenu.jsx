import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MainMenu() {
  const navigate = useNavigate();
  const [nextRecommendedPath, setNextRecommendedPath] = useState('matematikbasic');

  const handleRecommendedPath = () => {
    switch (nextRecommendedPath) {
      case 'matematikbasic':
        setCurrentTest('MATEMATIKBASIC');
        setCurrentView('quiz');
        break;
      case 'calibration':
        setCurrentView('test-select');
        break;
      case 'red-categories':
      case 'yellow-categories':
        setCurrentView('decision-tree');
        break;
      default:
        setCurrentView('decision-tree');
    }
  };

  function handleGrindQuizStart ()  {
    navigate("/quiz");
  };
  function logoutUser () {
    logout();
    navigate("/");
  }
  const handleQuizComplete = (score) => {
    setFinalScore(score);
    setCurrentView('complete');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="flex">
        <main className="flex-1">
          <>
                <div className="bg-gradient-to-b from-blue-50 to-teal-600 min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="container mx-auto text-center z-10 max-w-4xl px-8">
                    <div className="mt-8 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                              onClick={() => handleGrindQuizStart()}
                              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                              Börja öva
                            </button>
                            <button
                              onClick={() => navigate('/category-stats')}
                              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                            >
                              Kuskapsöversikt
                            </button>
                          </div>
                      
                    </div>
                  </div>
                </div>
            </>
        </main>
      </div>
    </div>
  );
}

export default MainMenu;