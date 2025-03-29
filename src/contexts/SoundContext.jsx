import React, { createContext, useContext, useState } from 'react';

const SoundContext = createContext({
  isMuted: false,
  toggleMute: () => {}
});

export const SoundProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  return (
    <SoundContext.Provider
      value={{
        isMuted,
        toggleMute
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);
