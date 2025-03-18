import React from 'react';
import { jsx as _jsx } from "react/jsx-runtime";
export const QuizButton = ({
  text,
  onClick,
  disabled = false,
  className = ""
}) => {
  return /*#__PURE__*/_jsx("button", {
    onClick: onClick,
    disabled: disabled,
    className: `
        px-6 py-3 bg-white/50 backdrop-blur-sm rounded-xl 
        shadow-lg border border-teal-100 text-blue-600 font-bold
        hover:bg-white/60 transition-all transform hover:scale-105
        active:scale-95 disabled:hover:scale-100 disabled:hover:bg-white/50
        ${className}
      `,
    children: text
  });
};
