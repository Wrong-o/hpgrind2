import React from 'react';

const StatCard = ({ title, totalAnswers, correctAnswers, averageTime }) => {
  // Calculate percentage if there are answers, otherwise 0
  const percentage = totalAnswers > 0 
    ? (correctAnswers / totalAnswers) * 100 
    : 0;

  // Determine color based on criteria
  let colorClass;
  if (totalAnswers === 0) {
    colorClass = 'bg-gray-200';
  } else if (percentage < 79) {
    colorClass = 'bg-red-200';
  } else if (averageTime > 15) {
    colorClass = 'bg-yellow-200';
  } else {
    colorClass = 'bg-green-200';
  }

  return (
    <div className={`${colorClass} p-6 rounded-lg shadow-md transition-all duration-300`}>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="space-y-2">
        <p className="text-gray-700">
          Rätt svar: {totalAnswers > 0 ? `${percentage.toFixed(1)}%` : 'Inga svar än'}
        </p>
        <p className="text-gray-700">
          Genomsnittlig tid: {totalAnswers > 0 ? `${averageTime.toFixed(1)}s` : '-'}
        </p>
        <p className="text-gray-700">
          Antal svar: {totalAnswers}
        </p>
      </div>
    </div>
  );
};

const DemoStats = ({ 
  answeredMultiplication, correctMultiplication,
  answeredDivision, correctDivision,
  answeredAddition, correctAddition,
  answeredSubtraction, correctSubtraction,
  results
}) => {
  // Calculate average times for each category
  const getAverageTime = (category) => {
    const categoryResults = results.filter(r => r.category === category);
    if (categoryResults.length === 0) return 0;
    return categoryResults.reduce((acc, curr) => acc + curr.timeSpent, 0) / categoryResults.length;
  };

  return (
    <div>
        <p className="text-gray-700 mb-4">Delmomenten har 3 olika färger: Rött: Du kan inte momentet tillräckligt bra. Gult: Du kan det, men är för långsam. Grönt: Du kan momentet tillräckligt snabbt</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <StatCard 
          title="Multiplikation" 
          totalAnswers={answeredMultiplication}
          correctAnswers={correctMultiplication}
          averageTime={getAverageTime('multiplication')}
      />
      <StatCard 
        title="Division" 
        totalAnswers={answeredDivision}
        correctAnswers={correctDivision}
        averageTime={getAverageTime('division')}
      />
      <StatCard 
        title="Addition" 
        totalAnswers={answeredAddition}
        correctAnswers={correctAddition}
        averageTime={getAverageTime('addition')}
      />
      <StatCard 
        title="Subtraktion" 
        totalAnswers={answeredSubtraction}
        correctAnswers={correctSubtraction}
        averageTime={getAverageTime('subtraction')}
      />
    </div>
    </div>
  );
};

export default DemoStats;
