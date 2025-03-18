import React, { createContext, useContext, useState } from 'react';
import { jsx as _jsx } from "react/jsx-runtime";
const SoundContext = /*#__PURE__*/createContext({
  isMuted: false,
  toggleMute: () => {}
});
export const SoundProvider = ({
  children
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  return /*#__PURE__*/_jsx(SoundContext.Provider, {
    value: {
      isMuted,
      toggleMute
    },
    children: children
  });
};
export const useSound = () => useContext(SoundContext);
