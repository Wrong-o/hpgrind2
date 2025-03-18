import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { WelcomePopup } from './WelcomePopup';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const LoginPage = ({
  onClose
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const {
    login,
    register
  } = useAuth();
  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        await login(email, password);
        onClose();
      } else {
        await register(email, password);
        setShowWelcome(true);
      }
    } catch (err) {
      // Handle different error types
      if (err.message?.includes('already registered')) {
        setError('Emailen har redan ett konto, försök att logga in istället');
      } else if (err.message?.includes('minst')) {
        setError(`Lösenordet är inte starkt nog: ${err.message}`);
      } else {
        setError('Något gick fel. Om det håller i sig, kontakta supporten');
      }
    }
  };
  if (showWelcome) {
    return /*#__PURE__*/_jsx(WelcomePopup, {
      onStart: onClose
    });
  }
  return /*#__PURE__*/_jsx("div", {
    className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50",
    children: /*#__PURE__*/_jsxs("div", {
      className: "bg-white rounded-xl p-8 max-w-md w-full mx-4 relative",
      children: [/*#__PURE__*/_jsx("button", {
        onClick: onClose,
        className: "absolute top-4 right-4 text-gray-500 hover:text-gray-700",
        children: "\u2715"
      }), /*#__PURE__*/_jsx("h2", {
        className: "text-2xl font-bold text-blue-600 mb-6",
        children: isLogin ? 'Logga in' : 'Skapa konto'
      }), error && /*#__PURE__*/_jsx("div", {
        className: "mb-4 p-3 bg-red-100 text-red-700 rounded-lg",
        children: error
      }), /*#__PURE__*/_jsxs("form", {
        onSubmit: handleSubmit,
        className: "space-y-4",
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Email"
          }), /*#__PURE__*/_jsx("input", {
            type: "email",
            value: email,
            onChange: e => setEmail(e.target.value),
            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:ring-blue-500 focus:border-blue-500",
            required: true
          })]
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "L\xF6senord"
          }), /*#__PURE__*/_jsx("input", {
            type: "password",
            value: password,
            onChange: e => setPassword(e.target.value),
            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:ring-blue-500 focus:border-blue-500",
            required: true
          }), isLogin && /*#__PURE__*/_jsxs("ul", {
            className: "list-disc list-inside",
            children: [/*#__PURE__*/_jsx("li", {
              children: "Minst 8 tecken"
            }), /*#__PURE__*/_jsx("li", {
              children: "Minst en stor bokstav"
            }), /*#__PURE__*/_jsx("li", {
              children: "Minst en liten bokstav"
            }), /*#__PURE__*/_jsx("li", {
              children: "Minst en siffra"
            }), /*#__PURE__*/_jsxs("li", {
              children: ["Minst ett specialtecken (!@#$%^&*(),.?\":", "|<>)"]
            })]
          })]
        }), /*#__PURE__*/_jsx("button", {
          type: "submit",
          className: "w-full py-2 px-4 bg-blue-600 text-white rounded-lg  hover:bg-blue-700 transition-colors",
          children: isLogin ? 'Logga in' : 'Skapa konto'
        })]
      }), /*#__PURE__*/_jsx("button", {
        onClick: () => {
          setIsLogin(!isLogin);
          setError(null);
        },
        className: "mt-4 text-sm text-blue-600 hover:text-blue-800",
        children: isLogin ? 'Har du inget konto? Skapa ett här' : 'Har du redan ett konto? Logga in här'
      })]
    })
  });
};
