import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ResultPage = ({ results, onReset }) => {
  const [visible, setVisible] = useState(false);
  
  // Categories with their colors
  const categories = {
    'multiplicera': { name: 'Multiplikation', color: 'bg-blue-500', textColor: 'text-blue-500', lightBg: 'bg-blue-50' },
    'dividera': { name: 'Division', color: 'bg-green-500', textColor: 'text-green-500', lightBg: 'bg-green-50' },
    'addera': { name: 'Addition', color: 'bg-yellow-500', textColor: 'text-yellow-600', lightBg: 'bg-yellow-50' },
    'subtrahera': { name: 'Subtraktion', color: 'bg-red-500', textColor: 'text-red-500', lightBg: 'bg-red-50' }
  };

  // Calculate statistics
  const totalQuestions = results.length;
  const correctAnswers = results.filter(result => result.correct).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const totalTime = results.reduce((total, result) => total + result.timeSpent, 0);
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;

  // Calculate category-specific statistics
  const categoryStats = Object.keys(categories).map(catKey => {
    const categoryResults = results.filter(r => r.category.includes(catKey));
    const totalCatQuestions = categoryResults.length;
    const correctCatAnswers = categoryResults.filter(r => r.correct).length;
    const catAccuracy = totalCatQuestions > 0 ? Math.round((correctCatAnswers / totalCatQuestions) * 100) : 0;
    const catTime = categoryResults.reduce((total, r) => total + r.timeSpent, 0);
    const catMinutes = Math.floor(catTime / 60);
    const catSeconds = catTime % 60;
    
    return {
      key: catKey,
      ...categories[catKey],
      questions: totalCatQuestions,
      correct: correctCatAnswers,
      accuracy: catAccuracy,
      time: catTime,
      timeFormatted: `${catMinutes > 0 ? catMinutes + 'm ' : ''}${catSeconds}s`
    };
  }).filter(cat => cat.questions > 0); // Only include categories that have questions

  // Apply fade-in effect after component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl w-full bg-white rounded-xl shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 py-6 px-8">
          <h2 className="text-3xl font-bold text-white text-center">Demo Resultat</h2>
          <p className="text-center text-blue-100 mt-2">Bra jobbat! Du har svarat på alla demo-uppgifter.</p>
        </div>
        
        <div className="p-6 sm:p-8 space-y-8">
          {/* Overall Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.9 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-50 rounded-lg p-5 text-center shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Tid</h3>
              <p className="text-3xl font-bold text-gray-800">
                {minutes > 0 ? `${minutes}m ` : ''}{seconds}s
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.9 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gray-50 rounded-lg p-5 text-center shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Rätta Svar</h3>
              <p className="text-3xl font-bold text-gray-800">
                {correctAnswers}/{totalQuestions}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.9 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gray-50 rounded-lg p-5 text-center shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Noggrannhet</h3>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-gray-800">
                      {accuracy}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div style={{ width: `${accuracy}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Category-specific results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Resultat per kategori</h3>
            
            <div className="space-y-4">
              {categoryStats.map((cat, index) => (
                <motion.div 
                  key={cat.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -20 }}
                  transition={{ duration: 0.5, delay: 0.7 + (index * 0.1) }}
                  className="border rounded-lg overflow-hidden shadow-sm"
                >
                  <div className={`${cat.color} px-4 py-3`}>
                    <h4 className="font-medium text-white text-lg">{cat.name}</h4>
                  </div>
                  <div className={`p-4 ${cat.lightBg}`}>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-600">Noggrannhet</p>
                        <p className={`font-bold text-lg ${cat.textColor}`}>{cat.accuracy}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Rätta Svar</p>
                        <p className={`font-bold text-lg ${cat.textColor}`}>{cat.correct}/{cat.questions}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tid</p>
                        <p className={`font-bold text-lg ${cat.textColor}`}>{cat.timeFormatted}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Action buttons */}
          <motion.div 
            className="flex justify-center pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <button
              onClick={onReset}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              Börja om
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultPage;

