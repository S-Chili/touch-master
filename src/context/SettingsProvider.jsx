// src/context/SettingsProvider.jsx
import React, { useState } from 'react';
import { SettingsContext } from './SettingsContext.jsx'; // 1. ІМПОРТ З НОВОГО ФАЙЛУ

// Експортуємо ЛИШЕ компонент Provider (Fast Refresh буде задоволений)
export const SettingsProvider = ({ children }) => {
  // ... (весь Ваш код залишається без змін) ...
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
  // ...
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};