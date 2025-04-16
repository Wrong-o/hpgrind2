import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../contexts/DatabaseContext';
import FocusPractice from '../components/FocusPractice';
import MenuButton from '../components/MenuButton';
import SmallButton from '../components/SmallButton';
import Updates from '../components/Updates';
import { 
  Cog6ToothIcon, 
  ChartBarIcon, 
  AcademicCapIcon,
  XMarkIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

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
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Menu Buttons */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 border-b-2 border-blue-500 pb-2 inline-block">Meny</h2>
            <MenuButton
              onClick={() => handleGrindQuizStart()}
              className="w-full bg-blue-600 text-white px-4 py-3 md:px-6 md:py-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-base md:text-lg"
              text="Kalibrering: Träna brett för att få bättre rekommendationer"
              icon={<AcademicCapIcon className="w-5 h-5 md:w-6 md:h-6" />}
            />
            <MenuButton
              onClick={() => navigate('/category-stats')}
              className="w-full bg-teal-600 text-white px-4 py-3 md:px-6 md:py-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-base md:text-lg"
              text="Momentträd: Se dina moment"
              icon={<ChartBarIcon className="w-5 h-5 md:w-6 md:h-6" />}
            />
            <MenuButton
              onClick={() => navigate('/customize-experience')}
              className="w-full bg-indigo-600 text-white px-4 py-3 md:px-6 md:py-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-base md:text-lg"
              text="Anpassa din upplevelse"
              icon={<Cog6ToothIcon className="w-5 h-5 md:w-6 md:h-6" />}
            />
          </div>

          {/* Middle Column - Moment Cards */}
          <div className="w-full lg:w-1/3 lg:border-l border-gray-200 p-4 md:p-8 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 border-b-2 border-red-500 pb-2 inline-block">LOCK IN: Bäst värde</h2>
            {redMoments.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {redMoments.map((moment) => (
                  <div
                    key={moment.moment}
                    className="bg-white rounded-lg shadow-md p-4 md:p-6 border-l-4"
                    style={{ borderLeftColor: ProgressColors.RED }}
                  >
                    <h3 className="font-semibold text-base md:text-lg mb-2">
                      {momentTitles[moment.moment] || moment.moment}
                    </h3>
                    <div className="text-xs md:text-sm text-gray-600 mb-3">
                      <p>Rätt svar: {moment.correct} av {moment.total_answers}</p>
                      <p>Träffsäkerhet: {Math.round(moment.accuracy * 100)}%</p>
                    </div>
                    <MenuButton
                      onClick={() => setSelectedPracticeNode({ id: moment.moment })}
                      className="w-auto px-4 py-2 bg-red-500 text-white text-xl rounded hover:bg-blue-600 transition-colors ml-auto"
                      text="Träna nu"
                      icon={<PlayIcon className="w-4 h-4" />}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-6">
                <p>Gör kalibreringen för att få bättre rekommendationer!</p>
              </div>
            )}
          </div>

          {/* Right Column - Updates */}
          <div className="w-full lg:w-1/3 lg:border-l border-gray-200 p-4 md:p-8 bg-white rounded-lg shadow-sm">
            <Updates />
          </div>
        </div>
      </div>

      {/* Practice Modal */}
      {selectedPracticeNode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full h-[90vh] md:w-3/4 md:h-5/6 rounded-lg relative overflow-auto">
            <SmallButton
              onClick={() => setSelectedPracticeNode(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1 z-10"
              icon={<XMarkIcon className="w-4 h-4" />}
            />
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