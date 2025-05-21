import React from 'react';
import { useNavigate } from 'react-router-dom';
import MenuButton from '../components/MenuButton';
import { useTheme, themes } from '../contexts/ThemeContext';
import { useSound, soundPacks } from '../contexts/SoundContext';
import SoundDebugger from '../components/SoundDebugger';
import { 
  SpeakerWaveIcon, 
  SwatchIcon, 
  LockClosedIcon,
  ArrowLeftIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

// Modified SubButton for color selection
const ColorButton = ({ theme, themeKey, currentTheme, onSelect }) => {
  const isSelected = currentTheme === themeKey;
  
  return (
    <button 
      onClick={() => onSelect(themeKey)}
      className={`
        w-full px-4 py-3 rounded-lg text-sm font-medium 
        flex items-center justify-between
        bg-white hover:bg-gray-50 border-2
        ${isSelected ? `border-${theme.primary}-500` : 'border-gray-200'}
      `}
    >
      <div className="flex items-center">
        <div className={`w-6 h-6 rounded-full bg-${theme.primary}-500 mr-3`}></div>
        <span className="text-gray-800">{theme.name}</span>
      </div>
      
      {isSelected && <CheckIcon className={`w-5 h-5 text-${theme.primary}-500`} />}
    </button>
  );
};

// Sound pack button
const SoundButton = ({ soundPackKey, currentSoundPack, onSelect, locked = false }) => {
  const packData = soundPacks[soundPackKey];
  const isSelected = currentSoundPack === soundPackKey;
  
  const handleClick = () => {
    if (!locked) {
      onSelect(soundPackKey);
      // Play a sample of the selected sound pack
      setTimeout(() => {
        try {
          // Create an audio element programmatically instead of relying on the DOM element
          const audio = new Audio(packData.sounds.correct);
          audio.volume = 0.3;
          
          // Add event listeners for error handling
          audio.addEventListener('error', (e) => {
            console.warn(`Error playing demo sound for ${soundPackKey}:`, e);
          });
          
          // Add a loading timeout in case the sound takes too long
          const timeoutId = setTimeout(() => {
            console.log(`Demo sound for ${soundPackKey} is taking too long to load, aborting.`);
            audio.src = '';
          }, 3000);
          
          // Clear timeout when the sound plays
          audio.addEventListener('playing', () => {
            clearTimeout(timeoutId);
          });
          
          // Play the sound
          audio.play().catch(err => {
            console.log('Demo sound failed:', err);
            clearTimeout(timeoutId);
            
            // Try a fallback sound
            if (packData.sounds.correct.endsWith('.wav')) {
              const fallbackAudio = new Audio(packData.sounds.correct.replace('.wav', '.mp3'));
              fallbackAudio.volume = 0.3;
              fallbackAudio.play().catch(fallbackErr => {
                console.log('Fallback sound also failed:', fallbackErr);
              });
            } else if (packData.sounds.correct.endsWith('.mp3')) {
              const fallbackAudio = new Audio(packData.sounds.correct.replace('.mp3', '.wav'));
              fallbackAudio.volume = 0.3;
              fallbackAudio.play().catch(fallbackErr => {
                console.log('Fallback sound also failed:', fallbackErr);
              });
            }
          });
        } catch (err) {
          console.error('Failed to create audio element:', err);
        }
      }, 100);
    }
  };
  
  // Determine if this is a free pack (standard and meme packs are free, others are premium)
  const isFree = soundPackKey === 'standard' || soundPackKey === 'meme' || soundPackKey === 'default';
  const actuallyLocked = locked && !isFree;
  
  return (
    <button 
      className={`
        w-full px-4 py-3 rounded-lg text-sm font-medium 
        flex items-center justify-between
        ${actuallyLocked 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : `bg-white text-gray-800 hover:bg-gray-50 ${isSelected ? 'border-2 border-blue-500' : 'border border-gray-200'}`
        }
      `}
      disabled={actuallyLocked}
      onClick={actuallyLocked ? undefined : handleClick}
    >
      <div className="flex flex-col items-start">
        <span className="font-medium">{packData.name}</span>
        <span className="text-xs text-gray-500">{packData.description}</span>
      </div>
      {actuallyLocked && <LockClosedIcon className="w-4 h-4" />}
      {isSelected && !actuallyLocked && <CheckIcon className="w-5 h-5 text-blue-500" />}
    </button>
  );
};

// Simple toggle button for sound on/off
const SoundToggleButton = ({ isMuted, onToggle }) => (
  <button 
    onClick={onToggle}
    className={`
      w-full px-4 py-3 rounded-lg text-sm font-medium 
      flex items-center justify-between
      bg-white hover:bg-gray-50 border
      ${isMuted ? 'border-gray-200' : 'border-2 border-blue-500'}
    `}
  >
    <div className="flex items-center">
      <SpeakerWaveIcon className={`w-5 h-5 mr-2 ${isMuted ? 'text-gray-400' : 'text-blue-500'}`} />
      <span>{isMuted ? 'Ljud av' : 'Ljud på'}</span>
    </div>
    {!isMuted && <CheckIcon className="w-5 h-5 text-blue-500" />}
  </button>
);

const Customization = () => {
  const navigate = useNavigate();
  const { themes, currentTheme, changeTheme, getThemeClasses } = useTheme();
  const { isMuted, toggleMute, soundPack, setSoundPack, playSound } = useSound();

  // Function to play a demo sound from a pack
  const playDemoSound = (packId, soundName = 'correct') => {
    if (soundPacks[packId]) {
      try {
        const audio = new Audio(soundPacks[packId].sounds[soundName]);
        audio.volume = 0.3;
        
        // Add event listeners for error handling
        audio.addEventListener('error', (e) => {
          console.warn(`Error playing demo sound "${soundName}" for ${packId}:`, e);
        });
        
        // Add a loading timeout in case the sound takes too long
        const timeoutId = setTimeout(() => {
          console.log(`Demo sound for ${packId} is taking too long to load, aborting.`);
          audio.src = '';
        }, 3000);
        
        // Clear timeout when the sound plays
        audio.addEventListener('playing', () => {
          clearTimeout(timeoutId);
        });
        
        // Play the sound
        audio.play().catch(err => {
          console.log('Demo playback failed:', err);
          clearTimeout(timeoutId);
          
          // Try a fallback sound with a different extension
          const soundPath = soundPacks[packId].sounds[soundName];
          if (soundPath.endsWith('.wav')) {
            const fallbackAudio = new Audio(soundPath.replace('.wav', '.mp3'));
            fallbackAudio.volume = 0.3;
            fallbackAudio.play().catch(fallbackErr => {
              console.log('Fallback sound also failed:', fallbackErr);
            });
          } else if (soundPath.endsWith('.mp3')) {
            const fallbackAudio = new Audio(soundPath.replace('.mp3', '.wav'));
            fallbackAudio.volume = 0.3;
            fallbackAudio.play().catch(fallbackErr => {
              console.log('Fallback sound also failed:', fallbackErr);
            });
          }
        });
      } catch (err) {
        console.error('Failed to create audio element:', err);
      }
    }
  };

  // Organize soundpacks to display free ones first
  const organizedSoundPacks = {
    free: Object.keys(soundPacks).filter(key => 
      key === 'standard' || key === 'meme' || key === 'default'
    ),
    premium: Object.keys(soundPacks).filter(key => 
      key !== 'standard' && key !== 'meme' && key !== 'default'
    )
  };

  return (
    <div className={`min-h-screen ${getThemeClasses('background')}`}>
      <div className="container mx-auto h-full">
        <div className="flex h-full">
          {/* Left Column - Menu Buttons */}
          <div className="w-full md:w-1/3 p-8 flex flex-col gap-4">
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
                  Ljudinställningar
                </h3>
              </div>
              
              <div className="mb-4">
                <SoundToggleButton 
                  isMuted={isMuted} 
                  onToggle={toggleMute} 
                />
              </div>
              
              <h4 className="font-medium text-gray-700 mb-2">Ljudpaket</h4>
              
              {/* Free soundpacks */}
              <div className="space-y-3 mb-4">
                <h5 className="text-sm font-medium text-blue-600">Fria Ljudpaket</h5>
                {organizedSoundPacks.free.map(packKey => (
                  <SoundButton 
                    key={packKey}
                    soundPackKey={packKey}
                    currentSoundPack={soundPack}
                    onSelect={setSoundPack}
                    locked={false}
                  />
                ))}
              </div>
              
              {/* Premium soundpacks */}
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-indigo-600">Premium Ljudpaket</h5>
                {organizedSoundPacks.premium.map(packKey => (
                  <SoundButton 
                    key={packKey}
                    soundPackKey={packKey}
                    currentSoundPack={soundPack}
                    onSelect={setSoundPack}
                    locked={packKey !== soundPack} // Locked unless already selected
                  />
                ))}
              </div>
              
              <div className="mt-4 text-xs text-gray-500 italic">
                Fler ljudpaket låses upp med Premium.
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <SwatchIcon className="w-6 h-6" />
                  Färger
                </h3>
              </div>
              <div className="space-y-3">
                {Object.entries(themes).map(([key, theme]) => (
                  <ColorButton 
                    key={key}
                    theme={theme}
                    themeKey={key}
                    currentTheme={currentTheme}
                    onSelect={changeTheme}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Premium Info */}
          <div className="hidden md:block md:w-2/3 border-l border-gray-200 p-8 bg-white">
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
            
            <div className="mt-8 bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Förhandsgranska tema</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${getThemeClasses('background')} shadow-sm`}>
                  <p className={`font-medium ${getThemeClasses('primaryText')}`}>Bakgrund</p>
                </div>
                <div className={`p-4 rounded-lg ${getThemeClasses('primaryButton')} shadow-sm`}>
                  <p className="font-medium text-white">Primärknapp</p>
                </div>
                <div className={`p-4 rounded-lg ${getThemeClasses('secondaryButton')} shadow-sm`}>
                  <p className="font-medium text-white">Sekundärknapp</p>
                </div>
                <div className={`p-4 rounded-lg ${getThemeClasses('accentButton')} shadow-sm`}>
                  <p className="font-medium text-white">Accentknapp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sound Debugger tool - remove this in production */}
      <SoundDebugger />
    </div>
  );
};

export default Customization;

