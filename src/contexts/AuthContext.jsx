import React, { createContext, useContext, useState } from 'react';
import { jsx as _jsx } from "react/jsx-runtime";
const AuthContext = /*#__PURE__*/createContext(undefined);
export const AuthProvider = ({
  children
}) => {
  const [user, setUser] = useState(null);
  const login = async (email, password) => {
    // Implement your login logic here
    const response = await fakeApiLogin(email, password);
    if (response.success) {
      setUser(response.user);
    } else {
      throw new Error(response.message);
    }
  };
  const register = async (email, password) => {
    // Implement your registration logic here
    const response = await fakeApiRegister(email, password);
    if (response.success) {
      setUser(response.user);
    } else {
      throw new Error(response.message);
    }
  };
  const logout = () => {
    setUser(null);
  };
  return /*#__PURE__*/_jsx(AuthContext.Provider, {
    value: {
      login,
      register,
      logout,
      user
    },
    children: children
  });
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock API functions for demonstration purposes
const fakeApiLogin = async (email, password) => {
  // Simulate an API call
  if (email === 'test@example.com' && password === 'Password1!') {
    return {
      success: true,
      user: {
        email
      }
    };
  }
  return {
    success: false,
    message: 'Invalid credentials'
  };
};
const fakeApiRegister = async (email, password) => {
  // Simulate an API call
  if (email && password) {
    return {
      success: true,
      user: {
        email
      }
    };
  }
  return {
    success: false,
    message: 'Registration failed'
  };
};
