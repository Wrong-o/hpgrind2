import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../contexts/DatabaseContext';
import FocusPractice from '../components/FocusPractice';

function MainMenu() {
  const { categoryStats, isLoading, error, ProgressColors } = useDatabase();
  const navigate = useNavigate();
  const [selectedPracticeNode, setSelectedPracticeNode] = useState(null);

  // Filter moments with red progress
  const redMoments = useMemo(() => {
    if (!categoryStats) return [];
    return categoryStats.filter(stat => stat.classification === ProgressColors.RED);
  }, [categoryStats, ProgressColors]);

  // Map moment IDs to readable titles
  const momentTitles = {
    'basics_fraktioner_addera': 'Addera bråk',
    'basics_fraktioner_subtrahera': 'Subtrahera bråk',
    'basics_fraktioner_multiplicera': 'Multiplicera bråk',
    'basics_fraktioner_dividera': 'Dividera bråk',
    // Add more mappings as needed
  };

  function handleGrindQuizStart() {
    navigate("/quiz");
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <p className="text-gray-600">Laddar...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto h-full">
        <div className="flex h-full">
          {/* Left Column - Menu Buttons */}
          <div className="w-1/3 p-8 flex flex-col gap-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Meny</h2>
            <button
              onClick={() => handleGrindQuizStart()}
              className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg"
            >
              Kalibrering: Träna brett för att få bättre rekommendationer
            </button>
            <button
              onClick={() => navigate('/category-stats')}
              className="w-full bg-teal-600 text-white px-6 py-4 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 text-lg"
            >
              Momentträd: Se dina moment
            </button>
          </div>

          {/* Right Column - Moment Cards */}
          <div className="w-1/2 border-l border-gray-200 p-8 bg-white">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">LOCK IN: Mest värde att öva på</h2>
            {redMoments.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {redMoments.map((moment) => (
                  <div
                    key={moment.moment}
                    className="bg-white rounded-lg shadow-md p-6 border-l-4"
                    style={{ borderLeftColor: ProgressColors.RED }}
                  >
                    <h3 className="font-semibold text-lg mb-2">
                      {momentTitles[moment.moment] || moment.moment}
                    </h3>
                    <div className="text-sm text-gray-600 mb-4">
                      <p>Rätt svar: {moment.correct} av {moment.total_answers}</p>
                      <p>Träffsäkerhet: {Math.round(moment.accuracy * 100)}%</p>
                    </div>
                    <button
                      onClick={() => setSelectedPracticeNode({ id: moment.moment })}
                      className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Träna nu
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Inga moment behöver extra fokus just nu!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Practice Modal */}
      {selectedPracticeNode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full h-full md:w-3/4 md:h-5/6 rounded-lg relative">
            <button
              onClick={() => setSelectedPracticeNode(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <FocusPractice
              key={selectedPracticeNode.id}
              moment={selectedPracticeNode.id}
              onClose={() => setSelectedPracticeNode(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MainMenu;