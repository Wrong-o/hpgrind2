import React, { createContext, useContext, useState, useEffect } from 'react';
import { playWithFallback } from '../utils/soundUtils';

// Define sound packs
export const soundPacks = {
  default: {
    name: 'Classic',
    description: 'Standardljuden',
    sounds: {
      correct: '/sounds/correct.mp3',
      wrong: '/sounds/wrong.mp3',
      skip: '/sounds/click.mp3',
      hover: '/sounds/hover.wav'
    }
  },
  standard: {
    name: 'Modern',
    description: 'Lite modernare',
    sounds: {
      correct: '/sounds/packs/modern/correct.wav',
      wrong: '/sounds/packs/modern/wrong.wav',
      skip: '/sounds/packs/modern/skip.wav',
      hover: '/sounds/packs/modern/hover.wav'
    }
  },
  meme: {
    name: 'Meme',
    description: 'Man måste ju inte ha tråkigt',
    sounds: {
      correct: '/sounds/packs/meme/correct.mp3',
      wrong: '/sounds/packs/meme/wrong.mp3',
      skip: '/sounds/packs/meme/skip.mp3',
      hover: '/sounds/packs/meme/hover.mp3'
    }
  },
  minimal: {
    name: 'Minimal',
    description: 'Subtle, modern sounds',
    sounds: {
      correct: '/sounds/correct.mp3',
      wrong: '/sounds/wrong.mp3',
      skip: '/sounds/click.mp3',
      hover: '/sounds/hover.wav'
    }
  },
  retro: {
    name: 'Retro 8-bit',
    description: 'Classic game sounds',
    sounds: {
      correct: '/sounds/correct.mp3',
      wrong: '/sounds/wrong.mp3',
      skip: '/sounds/click.mp3',
      hover: '/sounds/hover.wav'
    }
  },
  nature: {
    name: 'Nature',
    description: 'Calm nature sounds',
    sounds: {
      correct: '/sounds/correct.mp3',
      wrong: '/sounds/wrong.mp3',
      skip: '/sounds/click.mp3',
      hover: '/sounds/hover.wav'
    }
  }
};

const SoundContext = createContext({
  isMuted: false,
  soundPack: 'default',
  toggleMute: () => {},
  setSoundPack: () => {},
  playSound: () => {}
});

export const SoundProvider = ({ children }) => {
  // Get saved settings from localStorage or use defaults
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('sound_muted');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [soundPack, setSoundPack] = useState(() => {
    const saved = localStorage.getItem('sound_pack');
    return saved && soundPacks[saved] ? saved : 'default';
  });
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sound_muted', JSON.stringify(isMuted));
  }, [isMuted]);
  
  useEffect(() => {
    localStorage.setItem('sound_pack', soundPack);
  }, [soundPack]);
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const changeSoundPack = (packId) => {
    if (soundPacks[packId]) {
      setSoundPack(packId);
    }
  };
  
  // Generic function to play any sound from the current pack
  const playSound = (soundName, volume = 0.3) => {
    if (isMuted) return;
    
    try {
      const currentPack = soundPacks[soundPack] || soundPacks.default;
      const soundPath = currentPack.sounds[soundName];
      
      if (soundPath) {
        // Use our utility function for more robust playback
        playWithFallback(soundPath, volume)
          .then(success => {
            if (!success) {
              console.warn(`Failed to play ${soundName} sound from ${soundPack} pack`);
              
              // If non-default pack fails, try the default pack as fallback
              if (soundPack !== 'default') {
                const defaultSoundPath = soundPacks.default.sounds[soundName];
                if (defaultSoundPath && defaultSoundPath !== soundPath) {
                  console.log('Attempting fallback to default pack sound');
                  playWithFallback(defaultSoundPath, volume);
                }
              }
            }
          });
      } else {
        console.warn(`Sound "${soundName}" not found in pack "${soundPack}"`);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };
  
  return (
    <SoundContext.Provider
      value={{
        isMuted,
        soundPack,
        soundPacks,
        toggleMute,
        setSoundPack: changeSoundPack,
        playSound
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);
