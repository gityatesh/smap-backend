// src/ThemeContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// This creates the actual communication pipeline
export const ThemeContext = createContext();

// This component acts as the radio tower broadcasting the signals
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* children represents whatever component is tucked inside this wrapper */}
      {children}
    </ThemeContext.Provider>
  );
};