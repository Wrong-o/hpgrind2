import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const XYZStats = () => {
  const [stats, setStats] = useState([]);
  const {
    token
  } = useAuth();
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/xyz/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch XYZ stats:', error);
      }
    };
    fetchStats();
  }, [token]);
  return /*#__PURE__*/_jsx("div", {
    className: "grid gap-4",
    children: stats.map((stat, index) => /*#__PURE__*/_jsxs("div", {
      className: "bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:bg-white/60 transition-all cursor-pointer",
      children: [/*#__PURE__*/_jsx("h3", {
        className: "text-xl font-bold text-blue-600 mb-2",
        children: stat.subcategory
      }), /*#__PURE__*/_jsxs("div", {
        className: "grid grid-cols-3 gap-4 text-sm",
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("div", {
            className: "text-gray-600",
            children: "Korrekt"
          }), /*#__PURE__*/_jsxs("div", {
            className: "text-2xl font-bold text-green-600",
            children: [stat.correct_percentage, "%"]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("div", {
            className: "text-gray-600",
            children: "Snitt tid"
          }), /*#__PURE__*/_jsxs("div", {
            className: "text-2xl font-bold text-blue-600",
            children: [Math.round(stat.average_time), "s"]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("div", {
            className: "text-gray-600",
            children: "Antal fr\xE5gor"
          }), /*#__PURE__*/_jsx("div", {
            className: "text-2xl font-bold text-purple-600",
            children: stat.total_questions
          })]
        })]
      })]
    }, index))
  });
};
