import React from 'react';
import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
const equations = ['x²', '∑', '∫', 'π', '√', '±', '÷', '∞', 'θ', 'Δ', 'μ', 'σ', '%', '≈', 'XYZ'];
export const FloatingEquations = () => {
  return /*#__PURE__*/_jsx(_Fragment, {
    children: equations.map((equation, i) => {
      const leftPosition = Math.floor(Math.random() * 100);
      return /*#__PURE__*/_jsx("div", {
        style: {
          left: `${leftPosition}%`
        },
        className: `
              absolute animate-float
              text-blue-500/20 font-bold
              ${getRandomDelay()}
              ${getRandomSize()}
              select-none
            `,
        children: equation
      }, i);
    })
  });
};
const getRandomDelay = () => {
  const delays = ['animation-delay-0', 'animation-delay-1000', 'animation-delay-2000', 'animation-delay-3000', 'animation-delay-4000'];
  return delays[Math.floor(Math.random() * delays.length)];
};
const getRandomSize = () => {
  const sizes = ['text-2xl', 'text-3xl', 'text-4xl', 'text-5xl'];
  return sizes[Math.floor(Math.random() * sizes.length)];
};
