// src/context/SettingsProvider.jsx
import React, { useState } from 'react';
import { SettingsContext } from './SettingsContext.jsx'; 

export const SettingsProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); 
  const [theme, setTheme] = useState('dark'); 
  
  const toggleLanguage = () => {
    setLanguage(prevLang => (prevLang === 'en' ? 'uk' : 'en'));
  };

  const value = {
    language,
    theme,
    toggleLanguage,
    setTheme, 
  };
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};