import React from 'react';
import Logo from '../assets/favicon.svg?react';
import { useAuth } from '../contexts/AuthContext';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Header = ({
  onShowLogin
}) => {
  const {
    isLoggedIn
  } = useAuth();
  const handleDemoClick = () => {
    // Scroll to the features section or implement demo functionality
    const featuresSection = document.querySelector('#features');
    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  const handleHowItWorksClick = () => {
    // Scroll to the how it works section
    const howItWorksSection = document.querySelector('#how-it-works');
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return /*#__PURE__*/_jsx("header", {
    className: "bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-6 shadow-md sticky top-0 z-50",
    children: /*#__PURE__*/_jsxs("div", {
      className: "container mx-auto flex flex-col md:flex-row justify-between items-center",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center mb-4 md:mb-0",
        children: [/*#__PURE__*/_jsx(Logo, {
          className: "h-8 w-auto mr-3 fill-current text-white"
        }), /*#__PURE__*/_jsx("h1", {
          className: "text-2xl font-bold",
          children: "HPGrind"
        })]
      }), /*#__PURE__*/_jsx("nav", {
        children: /*#__PURE__*/_jsxs("ul", {
          className: "flex flex-wrap justify-center gap-3",
          children: [/*#__PURE__*/_jsx("li", {
            children: /*#__PURE__*/_jsx("button", {
              onClick: handleDemoClick,
              className: "px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg transition-colors",
              children: "Testa demo"
            })
          }), /*#__PURE__*/_jsx("li", {
            children: /*#__PURE__*/_jsx("button", {
              onClick: handleHowItWorksClick,
              className: "px-4 py-2 bg-transparent hover:bg-blue-500 text-white border border-white rounded-lg transition-colors",
              children: "Hur fungerar HPGrind"
            })
          }), !isLoggedIn && /*#__PURE__*/_jsx("li", {
            children: /*#__PURE__*/_jsx("button", {
              onClick: onShowLogin,
              className: "px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors",
              children: "Skapa konto"
            })
          })]
        })
      })]
    })
  });
};
export default Header;
