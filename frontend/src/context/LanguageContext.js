import React, { createContext, useState, useEffect } from 'react';
import i18n from '../i18n/i18n';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  // Update language when it changes
  const changeLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  // Initialize language from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      setLanguage(savedLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;