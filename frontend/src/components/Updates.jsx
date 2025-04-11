import React from 'react';
import { 
  SparklesIcon,
  BoltIcon,
  BugAntIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

const UpdateCard = ({ date, title, description, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'new':
        return <SparklesIcon className="w-5 h-5 text-green-500" />;
      case 'improvement':
        return <BoltIcon className="w-5 h-5 text-blue-500" />;
      case 'fix':
        return <BugAntIcon className="w-5 h-5 text-red-500" />;
      case 'coming':
        return <RocketLaunchIcon className="w-5 h-5 text-purple-500" />;
      default:
        return null;
    }
  };

  const getTypeStyle = () => {
    switch (type) {
      case 'new':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'improvement':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'fix':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'coming':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className={`rounded-lg border p-4 ${getTypeStyle()}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h3 className="font-semibold">{title}</h3>
        </div>
        <span className="text-sm opacity-75">{date}</span>
      </div>
      <p className="text-sm ml-7">{description}</p>
    </div>
  );
};

const Updates = () => {
  // Updates are manually maintained here
  const updates = [
    {
      date: '2024-03-20',
      title: 'Premium-funktioner på gång!',
      description: 'Snart kommer du kunna anpassa din upplevelse med olika ljudpaket och färgteman.',
      type: 'coming'
    },
    {
      date: '2024-03-19',
      title: 'Ny funktion: Momentträd',
      description: 'Nu kan du se alla dina moment i en överskådlig trädvy och följa din progression.',
      type: 'new'
    },
    {
      date: '2024-03-18',
      title: 'Förbättrad statistik',
      description: 'Vi har uppdaterat hur vi visar din framgång i olika moment med tydligare färgkodning.',
      type: 'improvement'
    },
    {
      date: '2024-03-17',
      title: 'Buggfix: Svarstider',
      description: 'Åtgärdade ett problem där svarstider ibland visades felaktigt i statistiken.',
      type: 'fix'
    }
  ];

  return (
    <>
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-yellow-500 pb-2 inline-block">
        Uppdateringar
      </h2>
      <div className="space-y-4">
        {updates.map((update, index) => (
          <UpdateCard
            key={index}
            date={update.date}
            title={update.title}
            description={update.description}
            type={update.type}
          />
        ))}
      </div>
    </>
  );
};

export default Updates;
