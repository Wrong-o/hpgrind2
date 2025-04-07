import React from 'react';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const WelcomePopup = ({
  onStart
}) => {
  return /*#__PURE__*/_jsx("div", {
    className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
    children: /*#__PURE__*/_jsxs("div", {
      className: "bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center",
      children: [/*#__PURE__*/_jsx("h2", {
        className: "text-2xl font-bold text-blue-600 mb-4",
        children: "V\xE4lkommen!"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-gray-600 mb-6",
        children: "Dina framsteg sparas nu"
      }), /*#__PURE__*/_jsx("button", {
        onClick: onStart,
        className: "px-6 py-3 bg-blue-600 text-white rounded-lg  hover:bg-blue-700 transition-colors font-bold",
        children: "B\xF6rja grinda"
      })]
    })
  });
};
