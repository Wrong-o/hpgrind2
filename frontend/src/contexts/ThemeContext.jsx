import React, { createContext, useContext, useState, useEffect } from 'react';

// Define available themes
export const themes = {
  default: {
    name: 'Standard',
    primary: 'blue',
    secondary: 'indigo',
    accent: 'teal',
    background: 'from-blue-50 to-white',
    cardBackground: 'white',
  },
  ocean: {
    name: 'Ocean',
    primary: 'cyan',
    secondary: 'blue',
    accent: 'emerald',
    background: 'from-cyan-50 to-blue-100',
    cardBackground: 'white',
  },
  sunset: {
    name: 'Sunset',
    primary: 'orange',
    secondary: 'red',
    accent: 'amber',
    background: 'from-amber-50 to-orange-100',
    cardBackground: 'white',
  },
  forest: {
    name: 'Forest',
    primary: 'green',
    secondary: 'emerald',
    accent: 'lime',
    background: 'from-green-50 to-emerald-100',
    cardBackground: 'white',
  },
  cosmic: {
    name: 'Cosmic',
    primary: 'purple',
    secondary: 'violet',
    accent: 'pink',
    background: 'from-purple-50 to-violet-100',
    cardBackground: 'white',
  },
};

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Get theme from localStorage or use default
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme && themes[savedTheme] ? savedTheme : 'default';
  });

  // Get CSS classes for various elements based on current theme
  const getThemeClasses = (element) => {
    const theme = themes[currentTheme];
    
    switch (element) {
      case 'primaryButton':
        return `bg-${theme.primary}-600 hover:bg-${theme.primary}-700 text-white`;
      case 'secondaryButton':
        return `bg-${theme.secondary}-600 hover:bg-${theme.secondary}-700 text-white`;
      case 'accentButton':
        return `bg-${theme.accent}-600 hover:bg-${theme.accent}-700 text-white`;
      case 'background':
        return `bg-gradient-to-b ${theme.background}`;
      case 'card':
        return `bg-${theme.cardBackground}`;
      case 'primaryText':
        return `text-${theme.primary}-600`;
      case 'secondaryText':
        return `text-${theme.secondary}-600`;
      case 'accentText':
        return `text-${theme.accent}-600`;
      case 'primaryBorder':
        return `border-${theme.primary}-500`;
      case 'secondaryBorder':
        return `border-${theme.secondary}-500`;
      default:
        return '';
    }
  };

  // Change theme and save to localStorage
  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('theme', themeName);
    }
  };

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
    
    // Apply theme to root element for global CSS variables (optional)
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  // Context value to provide
  const value = {
    themes,
    currentTheme,
    changeTheme,
    getThemeClasses,
    themeData: themes[currentTheme]
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 