import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const CategoryStats = ({
  onBack
}) => {
  const [stats, setStats] = useState([]);
  const {
    token
  } = useAuth();
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/category-stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch category stats:', error);
      }
    };
    if (token) {
      fetchStats();
    }
  }, [token]);
  return /*#__PURE__*/_jsxs("div", {
    className: "w-full max-w-4xl px-4 py-8 relative",
    children: [/*#__PURE__*/_jsx("button", {
      onClick: onBack,
      className: "absolute top-4 left-4 px-4 py-2 bg-blue-600 text-white  rounded-lg hover:bg-blue-700 transition-colors",
      children: "Tillbaka"
    }), /*#__PURE__*/_jsxs("div", {
      className: "space-y-4 mt-16",
      children: [/*#__PURE__*/_jsx("h2", {
        className: "text-xl font-bold text-blue-600 mb-4 text-center",
        children: "Dina framsteg per kategori"
      }), /*#__PURE__*/_jsx("div", {
        className: "grid gap-4 md:grid-cols-2",
        children: stats.map(stat => /*#__PURE__*/_jsxs("div", {
          className: "bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-lg",
          children: [/*#__PURE__*/_jsx("h3", {
            className: "font-bold text-lg mb-2",
            children: stat.category_name
          }), /*#__PURE__*/_jsxs("div", {
            className: "space-y-2",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex justify-between",
              children: [/*#__PURE__*/_jsx("span", {
                children: "Antal f\xF6rs\xF6k:"
              }), /*#__PURE__*/_jsx("span", {
                className: "font-medium",
                children: stat.total_attempts
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex justify-between",
              children: [/*#__PURE__*/_jsx("span", {
                children: "R\xE4tta svar:"
              }), /*#__PURE__*/_jsx("span", {
                className: "font-medium",
                children: stat.correct_attempts
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex justify-between",
              children: [/*#__PURE__*/_jsx("span", {
                children: "Tr\xE4ffs\xE4kerhet:"
              }), /*#__PURE__*/_jsxs("span", {
                className: "font-medium",
                children: [stat.accuracy, "%"]
              })]
            }), /*#__PURE__*/_jsx("div", {
              className: "w-full bg-gray-200 rounded-full h-2.5",
              children: /*#__PURE__*/_jsx("div", {
                className: "bg-blue-600 h-2.5 rounded-full transition-all duration-500",
                style: {
                  width: `${stat.accuracy}%`
                }
              })
            })]
          })]
        }, stat.category_id))
      })]
    })]
  });
};
