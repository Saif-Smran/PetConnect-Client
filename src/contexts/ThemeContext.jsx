import React, { createContext, useEffect, useState } from 'react';

// Create Theme Context
const ThemeContext = createContext();

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  // Load theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('petconnect-theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: light)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    console.log('Applying theme to document:', theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('petconnect-theme', theme);
  }, [theme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    console.log('toggleTheme called. Current theme:', theme);
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      console.log('Setting new theme:', newTheme);
      return newTheme;
    });
  };

  // Set specific theme
  const setSpecificTheme = (newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setTheme(newTheme);
    }
  };

  // Check if current theme is dark
  const isDark = theme === 'dark';

  const value = {
    theme,
    toggleTheme,
    setTheme: setSpecificTheme,
    isDark,
    isLight: !isDark
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext };
export default ThemeProvider;
