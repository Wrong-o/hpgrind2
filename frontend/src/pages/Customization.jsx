import React from 'react';
import { useNavigate } from 'react-router-dom';
import MenuButton from '../components/MenuButton';
import { 
  SpeakerWaveIcon, 
  SwatchIcon, 
  LockClosedIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const SubButton = ({ text, locked = true }) => (
  <button 
    className={`
      w-full px-4 py-2 rounded-lg text-sm font-medium 
      flex items-center justify-between
      ${locked 
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
        : 'bg-white text-gray-800 hover:bg-gray-50'
      }
    `}
    disabled={locked}
  >
    <span>{text}</span>
    {locked && <LockClosedIcon className="w-4 h-4" />}
  </button>
);

const Customization = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto h-full">
        <div className="flex h-full">
          {/* Left Column - Menu Buttons */}
          <div className="w-1/3 p-8 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-6">
              <button 
                onClick={() => navigate('/main-menu')}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2">
                Anpassa
              </h2>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <SpeakerWaveIcon className="w-6 h-6" />
                  Ljudpaket
                </h3>
                <LockClosedIcon className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-2">
                <SubButton text="Standard" locked={false} />
                <SubButton text="Bruh" locked={true} />
                <SubButton text="Svävande" locked={true} />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <SwatchIcon className="w-6 h-6" />
                  Färger
                </h3>
                <LockClosedIcon className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-2">
                <SubButton text="Standard" locked={false} />
                <SubButton text="Royal purple" locked={true} />
                <SubButton text="Nattsvart" locked={true} />
              </div>
            </div>
          </div>

          {/* Right Column - Premium Info */}
          <div className="w-2/3 border-l border-gray-200 p-8 bg-white">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-indigo-500 pb-2 inline-block">
              Premium funktioner
            </h2>
            
            <div className="bg-indigo-50 rounded-lg p-8 max-w-2xl">
              <h3 className="text-2xl font-bold text-indigo-900 mb-4">
                Premiumpaketet kommer snart!
              </h3>
              <p className="text-indigo-700 mb-4">
                Med premium får du tillgång till:
              </p>
              <ul className="list-disc list-inside text-indigo-600 space-y-2 ml-4">
                <li>Anpassade ljudpaket för en mer personlig upplevelse</li>
                <li>Unika färgteman för att matcha din stil</li>
                <li>Fler funktioner på väg...</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customization;

