import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  user: any; // Define the user type as needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode; // Define children prop
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  const login = async (email: string, password: string) => {
    // Implement your login logic here
    const response = await fakeApiLogin(email, password);
    if (response.success) {
      setUser(response.user);
    } else {
      throw new Error(response.message);
    }
  };

  const register = async (email: string, password: string) => {
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

  return (
    <AuthContext.Provider value={{ login, register, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock API functions for demonstration purposes
const fakeApiLogin = async (email: string, password: string) => {
  // Simulate an API call
  if (email === 'test@example.com' && password === 'Password1!') {
    return { success: true, user: { email } };
  }
  return { success: false, message: 'Invalid credentials' };
};

const fakeApiRegister = async (email: string, password: string) => {
  // Simulate an API call
  if (email && password) {
    return { success: true, user: { email } };
  }
  return { success: false, message: 'Registration failed' };
};
