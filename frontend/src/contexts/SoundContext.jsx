import React, { createContext, useContext, useState } from 'react';

export const SoundContext = createContext({
  isMuted: false,
  toggleMute: () => {},
  soundPack: 'Default',
  setSoundPack: () => {}
});

export const SoundProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [soundPack, setSoundPack] = useState('Default');
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const changeSoundPack = (newPack) => {
    setSoundPack(newPack);
  };
  
  return (
    <SoundContext.Provider
      value={{
        isMuted,
        toggleMute,
        soundPack,
        changeSoundPack
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);
